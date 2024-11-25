// import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chrome from "@sparticuz/chromium";

// vercel  serverless  puppeteer  chromium  deploy  500
export const config = {
  runtime: "experimental-edge"
};

export async function POST(req: Request) {
  try {
    const { content, margin } = await req.json();
    // const browser = await puppeteer.launch({
    //     headless: true
    //   });

    const browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath(),
      headless: chrome.headless
    });

    const page = await browser.newPage();

    await page.setContent(content);

    const marginPx = margin + "px";

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: marginPx,
        right: marginPx,
        bottom: 0,
        left: marginPx
      }
    });

    await page.setContent(content, {
      waitUntil: ["domcontentloaded", "networkidle0"]
    });

    await page.evaluateHandle("document.fonts.ready");

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=document.pdf"
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
