import * as fs from "node:fs";

async function modifyOpenAPIFile(url, filePath) {
  try {
    // Step 1: Fetch the openapi.json file from the given URL
    console.log(`Fetching OpenAPI file from ${url}...`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI file: ${response.statusText}`);
    }
    const openapiContent = await response.json();

    // Step 2: Modify the OpenAPI file as per the logic
    const paths = openapiContent.paths;
    for (const pathKey of Object.keys(paths)) {
      const pathData = paths[pathKey];
      for (const method of Object.keys(pathData)) {
        const operation = pathData[method];
        if (operation.tags && operation.tags.length > 0) {
          const tag = operation.tags[0];
          const operationId = operation.operationId;
          const toRemove = `${tag}-`;
          if (operationId.startsWith(toRemove)) {
            const newOperationId = operationId.substring(toRemove.length);
            operation.operationId = newOperationId;
          }
        }
      }
    }

    // Step 3: Save the modified content to the local file
    console.log(`Saving modified OpenAPI file to ${filePath}...`);
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(openapiContent, null, 2),
    );
    console.log("File successfully modified and saved.");
  } catch (err) {
    console.error("Error:", err);
  }
}

const url = "http://127.0.0.1:8000/api/v1/openapi.json";
const filePath = "./openapi.json";
modifyOpenAPIFile(url, filePath);
