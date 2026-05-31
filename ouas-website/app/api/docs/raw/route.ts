import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const docsPath = searchParams.get("path");

  if (!docsPath) {
    return NextResponse.json({ error: "Path parameter is required" }, { status: 400 });
  }

  // Ensure the path is somewhat safe (basic check against directory traversal)
  if (docsPath.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    // Construct the actual file path on the server
    // E.g., /docs/introduction -> app/docs/introduction/page.mdx
    // We remove the leading /docs/ if present to make path resolution simpler,
    // or we just map it directly.
    let relativePath = docsPath;
    if (relativePath.startsWith("/")) {
      relativePath = relativePath.slice(1);
    }
    
    // Check if it starts with "docs"
    if (!relativePath.startsWith("docs")) {
      return NextResponse.json({ error: "Path must start with /docs" }, { status: 400 });
    }

    // Typical Next.js app directory structure
    const fullPath = path.join(process.cwd(), "app", relativePath, "page.mdx");
    
    let fileContent = await fs.readFile(fullPath, "utf-8");
    
    // 1. Remove all import statements
    fileContent = fileContent.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, "");

    // 2. Transform DocHero to Markdown heading
    fileContent = fileContent.replace(/<DocHero([^>]+)\/>/g, (match, attrs) => {
      const titleMatch = attrs.match(/title=["']([^"']+)["']/);
      const subtitleMatch = attrs.match(/subtitle=["']([^"']+)["']/);
      const title = titleMatch ? titleMatch[1] : "";
      const subtitle = subtitleMatch ? subtitleMatch[1] : "";
      
      let replacement = `# ${title}\n\n---\n`;
      if (subtitle) {
        replacement += `\n${subtitle}\n`;
      }
      return replacement;
    });
    
    // 3. Cleanup leading newlines left after removing imports
    fileContent = fileContent.trimStart();

    // 4. Append the source URL
    const sourceUrl = `${request.nextUrl.origin}${docsPath}`;
    fileContent += `\n\n---\nSource: ${sourceUrl}\n`;
    
    // Return as plain text
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error reading doc file:", error);
    return NextResponse.json({ error: "Documentation file not found" }, { status: 404 });
  }
}
