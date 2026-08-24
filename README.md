# Evidence-Gated Stabilization project page

Responsive academic project page for **Evidence-Gated Stabilization for
Sparse-View 3D Gaussian Splatting**.

## Development

```sh
npm install
npm run dev
```

Run `npm test` for a production build and rendered HTML smoke test.

## Source material

- Paper content and figures are extracted from `resources/paper_v2.pdf`.
- The comparison interaction and synchronization behavior are adapted from the
  MIT-licensed `video-compare` package; its source and license are retained in
  `vendor/video-compare/`.
- Paper-specific RGB and depth result videos are stored in `public/videos/` and
  used by the synchronized comparison panels.
