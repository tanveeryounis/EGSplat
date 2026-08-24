import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the academic project page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting/);
  assert.match(html, /Tanveer Younis/);
  assert.match(html, /Method Overview/);
  assert.match(html, /Qualitative Comparisons/);
  assert.match(html, /Pause comparison videos/);
  assert.match(html, /Depth Comparison/);
  assert.match(html, /Off-Trajectory Comparison/);
  assert.match(html, /Near-Trajectory Comparison/);
  assert.match(html, /\/figures\/pipeline_v2\.png/);
  assert.match(html, /\/figures\/fig5\.png/);
  assert.match(html, /\/figures\/fig6\.png/);
  assert.match(html, /Citation/);
  assert.doesNotMatch(html, /Viewpoint-deviation results|Quantitative results for Ours|Component ablation on Mip-NeRF 360|RGB and depth comparison|Ablation results/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
