import axios from "axios";
import * as fs from "node:fs";

// Interface to define OpenAPI file structure (for type checking)
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

// Function to download the OpenAPI file from the given URL
async function downloadOpenAPIFile(url: string): Promise<OpenAPIContent> {
  try {
    console.log(`Attempting to fetch OpenAPI file from ${url}`);
    const response = await axios.get(url);
    return response.data; // Assuming the file is in JSON format
  } catch (error) {
    console.error(
      "Error downloading the OpenAPI file:",
      error?.message || error,
    );
    throw new Error("Download failed.");
  }
}

// Function to modify the OpenAPI content
async function modifyOpenAPIFile(filePath: string): Promise<void> {
  try {
    // Step 1: Download OpenAPI content from the server
    const openapiContent = await downloadOpenAPIFile(
      "http://localhost:8000/api/v1/openapi.json",
    );

    // Step 2: Modify the content based on the logic provided
    const paths = openapiContent.paths;
    for (const pathKey of Object.keys(paths)) {
      const pathData = paths[pathKey];
      for (const method of Object.keys(pathData)) {
        const operation = pathData[method];
        if (operation.tags && operation.tags.length > 0) {
          const tag = operation.tags[0];
          const operationId = operation.operationId;
          const toRemove = `${tag}-`;
          if (operationId?.startsWith(toRemove)) {
            const newOperationId = operationId.substring(toRemove.length);
            operation.operationId = newOperationId;
          }
        }
      }
    }

    // Step 3: Save the modified OpenAPI content back to the file system
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(openapiContent, null, 2),
    );
    console.log("File successfully modified and saved as", filePath);
  } catch (error) {
    console.error("Error modifying the OpenAPI file:", error?.message || error);
  }
}

// File path to save the modified OpenAPI content
const filePath = "./openapi.json";

// Run the modification process
modifyOpenAPIFile(filePath);
