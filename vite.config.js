import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";

function saveSubmissionsPlugin() {
  const handler = (req, res, next) => {
    // Strip query strings and base path
    const rawUrl = req.url || "";
    const cleanUrl = rawUrl.split("?")[0].replace(/^\/8func/, "");

    if (cleanUrl === "/api/save-quiz" && req.method === "POST") {
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", () => {
        try {
          const data = JSON.parse(body);
          const dir = path.resolve(process.cwd(), "submissions");
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          const rawTime = data.timestamp || new Date().toISOString();
          const safeTime = rawTime.replace(/[:.]/g, "-");
          const type = (data.mbtiType || data.derivedType || "result").toUpperCase();
          const mode = data.mode || "quiz";
          const filename = `quiz_${safeTime}_${type}_${mode}.json`;
          const filePath = path.join(dir, filename);
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
          console.log(`[8Func Vault] ✓ Saved submission secretly to: submissions/${filename}`);
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, file: filename }));
        } catch (err) {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    if (cleanUrl === "/api/submissions" && req.method === "GET") {
      try {
        const dir = path.resolve(process.cwd(), "submissions");
        if (!fs.existsSync(dir)) {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify([]));
          return;
        }
        const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
        const list = files.map(f => {
          try {
            const content = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
            return {
              file: f,
              timestamp: content.timestamp,
              localTime: content.localTime,
              mbtiType: content.mbtiType,
              mode: content.mode,
              matchPercentage: content.matchPercentage
            };
          } catch {
            return { file: f };
          }
        });
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(list));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    next();
  };

  return {
    name: "save-submissions-plugin",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig({
  base: "/8func/",
  plugins: [saveSubmissionsPlugin()],
  build: {
    outDir: "dist"
  }
});
