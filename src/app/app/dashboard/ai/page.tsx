"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DeepSeekLogo from "@/components/ai/icon/IconDeepseek";
import IconDoubao from "@/components/ai/icon/IconDoubao";
import IconCustom from "@/components/ai/icon/IconCustom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useAIConfigStore } from "@/store/useAIConfigStore";
import { cn } from "@/lib/utils";

const AISettingsPage = () => {
  const t = useTranslations();
  const {
    selectedModel,
    doubaoApiKey,
    doubaoModelId,
    deepseekApiKey,
    customApiKey,
    customBaseURL,
    customModelId,
    setSelectedModel,
    setDoubaoApiKey,
    setDoubaoModelId,
    setDeepseekApiKey,
    setCustomApiKey,
    setCustomBaseURL,
    setCustomModelId
  } = useAIConfigStore();

  const [currentModel, setCurrentModel] = useState("");

  useEffect(() => {
    setCurrentModel(selectedModel);
  }, [selectedModel]);

  const handleApiKeyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: AIModelType
  ) => {
    const value = e.target.value;
    switch (type) {
      case "doubao":
        setDoubaoApiKey(value);
        break;
      case "deepseek":
        setDeepseekApiKey(value);
        break;
      case "custom":
        setCustomApiKey(value);
        break;
    }
  };

  const models = [
    {
      id: "deepseek",
      name: t("dashboard.settings.ai.deepseek.title"),
      description: t("dashboard.settings.ai.deepseek.description"),
      icon: DeepSeekLogo,
      link: "https://platform.deepseek.com",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      isConfigured: !!deepseekApiKey
    },
    {
      id: "doubao",
      name: t("dashboard.settings.ai.doubao.title"),
      description: t("dashboard.settings.ai.doubao.description"),
      icon: IconDoubao,
      link: "https://console.volcengine.com/ark",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      isConfigured: !!(doubaoApiKey && doubaoModelId)
    },
    {
      id: "custom",
      name: t("dashboard.settings.ai.custom.title"),
      description: t("dashboard.settings.ai.custom.description"),
      icon: IconCustom,
      link: "#",
      color: "text-gray-500",
      bgColor: "bg-gray-50 dark:bg-gray-950/50",
      isConfigured: !!(customApiKey && customBaseURL && customModelId)
    }
  ];

  return (
    <div className="mx-auto py-4 px-4">
      <div className="flex gap-8">
        {/* 左侧边栏 */}
        <div className="w-64 space-y-6">
          <div>
            <Label className="text-sm mb-2 block text-muted-foreground">
              {t("dashboard.settings.ai.currentModel")}
            </Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("dashboard.settings.ai.selectModel")}
                />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem
                    key={model.id}
                    value={model.id}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <model.icon className={cn("h-4 w-4", model.color)} />
                      <span>{model.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-[1px] bg-gray-200 dark:bg-gray-800" />

          {/* 模型切换列表 */}
          <div className="flex flex-col space-y-1">
            {models.map((model) => {
              const Icon = model.icon;
              const isActive = currentModel === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setCurrentModel(model.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-left relative",
                    "transition-all duration-200",
                    "hover:bg-primary/10",
                    isActive && "bg-primary/10"
                  )}
                >
                  <div
                    className={cn(
                      "shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span
                      className={cn(
                        "font-medium text-sm",
                        isActive && "text-primary"
                      )}
                    >
                      {model.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 右侧配置面板 */}
        <div className="flex-1 max-w-2xl">
          {models.map(
            (model) =>
              model.id === currentModel && (
                <div key={model.id} className="space-y-8">
                  {/* 标题和描述 */}
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                      <div className={cn("shrink-0", model.color)}>
                        <model.icon className="h-6 w-6" />
                      </div>
                      {model.name}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {model.description}
                    </p>
                  </div>

                  {/* 配置表单 */}
                  <div className="space-y-6">
                    {/* API Key 输入 */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                          {t(`dashboard.settings.ai.${model.id}.apiKey`)}
                        </Label>
                        {model.id !== "custom" && (
                          <a
                            href={model.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                          >
                            {t("dashboard.settings.ai.getApiKey")}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <Input
                        value={
                          model.id === "doubao"
                            ? doubaoApiKey
                            : model.id === "deepseek"
                            ? deepseekApiKey
                            : customApiKey
                        }
                        onChange={(e) =>
                          handleApiKeyChange(e, model.id as AIModelType)
                        }
                        type="password"
                        placeholder={t(
                          `dashboard.settings.ai.${model.id}.apiKey`
                        )}
                        className={cn(
                          "h-11",
                          "bg-white dark:bg-gray-900",
                          "border-gray-200 dark:border-gray-800",
                          "focus:ring-2 focus:ring-primary/20"
                        )}
                      />
                    </div>

                    {/* 豆包模型专属字段 */}
                    {model.id === "doubao" && (
                      <div className="space-y-4">
                        <Label className="text-base font-medium">
                          {t("dashboard.settings.ai.doubao.modelId")}
                        </Label>
                        <Input
                          value={doubaoModelId}
                          onChange={(e) => setDoubaoModelId(e.target.value)}
                          placeholder={t(
                            "dashboard.settings.ai.doubao.modelId"
                          )}
                          className={cn(
                            "h-11",
                            "bg-white dark:bg-gray-900",
                            "border-gray-200 dark:border-gray-800",
                            "focus:ring-2 focus:ring-primary/20"
                          )}
                        />
                      </div>
                    )}

                    {/* 自定义服务商专属字段 */}
                    {model.id === "custom" && (
                      <>
                        <div className="space-y-4">
                          <Label className="text-base font-medium">
                            {t("dashboard.settings.ai.custom.baseURL")}
                          </Label>
                          <Input
                            value={customBaseURL}
                            onChange={(e) => setCustomBaseURL(e.target.value)}
                            placeholder={t(
                              "dashboard.settings.ai.custom.baseURLplaceholder" // 修改点
                            )}
                            className={cn(
                              "h-11",
                              "bg-white dark:bg-gray-900",
                              "border-gray-200 dark:border-gray-800",
                              "focus:ring-2 focus:ring-primary/20"
                            )}
                          />
                        </div>
                        <div className="space-y-4">
                          <Label className="text-base font-medium">
                            {t("dashboard.settings.ai.custom.modelId")}
                          </Label>
                          <Input
                            value={customModelId}
                            onChange={(e) => setCustomModelId(e.target.value)}
                            placeholder={t(
                              "dashboard.settings.ai.custom.modelIdplaceholder" // 修改点
                            )}
                            className={cn(
                              "h-11",
                              "bg-white dark:bg-gray-900",
                              "border-gray-200 dark:border-gray-800",
                              "focus:ring-2 focus:ring-primary/20"
                            )}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default AISettingsPage;

type AIModelType = "doubao" | "deepseek" | "custom";
