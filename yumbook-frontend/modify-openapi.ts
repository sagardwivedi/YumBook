import axios from "axios";
import * as fs from "node:fs";

interface OpenAPIOperation {
  operationId?: string;
  tags?: string[];
}

interface OpenAPIPath {
  [method: string]: OpenAPIOperation;
}

interface OpenAPIContent {
  paths: { [pathKey: string]: OpenAPIPath };
}

async function downloadOpenAPIFile(
  url: string,
  filePath: string,
): Promise<void> {
  try {
    const response = await axios.get(url);
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(response.data, null, 2),
    );
    console.log("File downloaded and saved as openapi.json");
  } catch (error) {
    console.error("Error downloading the OpenAPI file:", error);
    throw error;
  }
}

async function modifyOpenAPIFile(filePath: string): Promise<void> {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    const openapiContent: OpenAPIContent = JSON.parse(data);

    for (const pathKey in openapiContent.paths) {
      const pathData = openapiContent.paths[pathKey];

      for (const method in pathData) {
        const operation = pathData[method];

        if (
          operation?.tags &&
          operation.tags.length > 0 &&
          operation.operationId
        ) {
          const tag = operation.tags[0];
          const toRemove = `${tag}-`;

          if (operation.operationId.startsWith(toRemove)) {
            operation.operationId = operation.operationId.substring(
              toRemove.length,
            );
          }
        }
      }
    }

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(openapiContent, null, 2),
    );
    console.log("File successfully modified");
  } catch (err) {
    console.error("Error modifying the OpenAPI file:", err);
  }
}

const openApiUrl = "http://localhost:8000/api/v1/openapi.json";
const filePath = "./openapi.json";

async function main() {
  try {
    // Step 1: Download the OpenAPI file
    await downloadOpenAPIFile(openApiUrl, filePath);

    // Step 2: Modify the downloaded OpenAPI file
    await modifyOpenAPIFile(filePath);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
