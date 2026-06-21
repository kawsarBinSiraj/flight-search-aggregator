import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        environment: "node",
        globals: true,
        include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: [
                "src/lib/**/*.ts",
                "src/store/**/*.ts",
                "src/services/**/*.ts",
                "src/app/api/**/*.ts",
            ],
            exclude: [
                "src/**/*.test.ts",
                "src/**/*.d.ts",
                "src/lib/mock-data.ts",
            ],
        },
    },
});
