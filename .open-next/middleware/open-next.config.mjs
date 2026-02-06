// open-next.config.ts
var config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy"
    }
  },
  functions: {
    admin: {
      routes: [
        "app/admin/page",
        "app/admin/marketing/page",
        "app/api/admin/marketing/send/route",
        "app/api/admin/marketing/stats/route",
        "app/api/admin/reviews/route",
        "app/api/admin/reviews/approve/route",
        "app/api/admin/reviews/reject/route",
        "app/api/admin/submissions/route",
        "app/api/admin/submissions/approve/route",
        "app/api/admin/submissions/reject/route",
        "app/api/admin/submissions/[submissionId]/route",
        "app/api/contact/route"
      ],
      patterns: ["/admin*", "/api/admin*", "/api/contact*"],
      override: {
        wrapper: "cloudflare-node",
        converter: "edge",
        proxyExternalRequest: "fetch",
        incrementalCache: "dummy",
        tagCache: "dummy",
        queue: "dummy"
      }
    },
    cms: {
      routes: [
        "app/studio/[[...tool]]/page",
        "app/blog/page",
        "app/blog/[slug]/page",
        "app/blog/category/[slug]/page",
        "app/blog/tag/[slug]/page",
        "app/api/blog/route"
      ],
      patterns: ["/studio*", "/blog*", "/api/blog*"],
      override: {
        wrapper: "cloudflare-node",
        converter: "edge",
        proxyExternalRequest: "fetch",
        incrementalCache: "dummy",
        tagCache: "dummy",
        queue: "dummy"
      }
    }
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy"
    }
  }
};
var open_next_config_default = config;
export {
  open_next_config_default as default
};
