import { ESLintUtils, TSESLint } from "@typescript-eslint/utils";
import { exhaustiveDepsRule } from "./exhaustive-deps.rule";
import { it, describe } from "vitest";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  settings: {},
});

TSESLint.RuleTester.describe = describe;
TSESLint.RuleTester.it = it;

ruleTester.run("exhaustive-deps", exhaustiveDepsRule, {
  valid: [
    {
      name: "should pass when deps are passed in array",
      code: 'useQuery({ queryKey: ["entity", id], queryFn: () => api.getEntity(id) });',
    },
    {
      name: "should pass when deps are passed in template literal",
      code: "useQuery({ queryKey: [`entity/${id}`], queryFn: () => api.getEntity(id) });",
    },
  ],
  invalid: [
    {
      name: "should fail when no deps are passed",
      code: `
          const id = 1;
          useQuery({ queryKey: ["entity"], queryFn: () => api.getEntity(id) });
        `,
      output: `
          const id = 1;
          useQuery({ queryKey: ["entity", id], queryFn: () => api.getEntity(id) });
        `,
      errors: [{ messageId: "missingDeps", data: { deps: "id" } }],
    },
    {
      name: "should fail when deps are passed incorrectly",
      code: `
          const id = 1;
          useQuery({ queryKey: ["entity/\${id}"], queryFn: () => api.getEntity(id) });
        `,
      output: `
          const id = 1;
          useQuery({ queryKey: ["entity/\${id}", id], queryFn: () => api.getEntity(id) });
        `,
      errors: [{ messageId: "missingDeps", data: { deps: "id" } }],
    },
  ],
});
