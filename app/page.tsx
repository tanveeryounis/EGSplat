import type { Metadata } from "next";
import {
  CitationBlock,
  SceneComparison,
  type ComparisonScene,
} from "./components/ProjectInteractions";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = (path: string) => `${basePath}${path}`;

export const metadata: Metadata = {
  title: "Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting",
  description:
    "Academic project page for Evidence-Gated Stabilization, a training-time framework for sparse-view 3D Gaussian Splatting.",
};

const scenes: ComparisonScene[] = [
  {
    id: "bench-8",
    name: "Scene 01",
    oursVideo: assetPath("/videos/rgb/bench_8-ours.mp4"),
    methods: [
      { id: "fsgs", name: "FSGS", video: assetPath("/videos/rgb/bench_8-fsgs.mp4") },
      { id: "3dgs", name: "3DGS", video: assetPath("/videos/rgb/bench_8-3dgs.mp4") },
      { id: "nexus", name: "NexusGS", video: assetPath("/videos/rgb/bench_8-nexus.mp4") },
      { id: "sparsegs", name: "SparseGS", video: assetPath("/videos/rgb/bench_8-sparsegs.mp4") },
    ],
  },
  {
    id: "water-8",
    name: "Scene 02",
    oursVideo: assetPath("/videos/rgb/water_8-ours.mp4"),
    methods: [
      { id: "fsgs", name: "FSGS", video: assetPath("/videos/rgb/water_8-fsgs.mp4") },
      { id: "nexus", name: "NexusGS", video: assetPath("/videos/rgb/water_8-nexus.mp4") },
      { id: "sparsegs", name: "SparseGS", video: assetPath("/videos/rgb/water_8-sparsegs.mp4") },
    ],
  },
  {
    id: "bench3-12",
    name: "Scene 03",
    oursVideo: assetPath("/videos/rgb/bench3_12-ours.mp4"),
    methods: [
      { id: "fsgs", name: "FSGS", video: assetPath("/videos/rgb/bench3_12-fsgs.mp4") },
      { id: "corgs", name: "COR-GS", video: assetPath("/videos/rgb/bench3_12-corgs.mp4") },
      { id: "nexus", name: "NexusGS", video: assetPath("/videos/rgb/bench3_12-nexus.mp4") },
      { id: "sparsegs", name: "SparseGS", video: assetPath("/videos/rgb/bench3_12-sparsegs.mp4") },
    ],
  },
  {
    id: "mall-12",
    name: "Scene 04",
    oursVideo: assetPath("/videos/rgb/mall_12-ours.mp4"),
    methods: [
      { id: "fsgs", name: "FSGS", video: assetPath("/videos/rgb/mall_12-fsgs.mp4") },
      { id: "3dgs", name: "3DGS", video: assetPath("/videos/rgb/mall_12-3dgs.mp4") },
      { id: "corgs", name: "COR-GS", video: assetPath("/videos/rgb/mall_12-corgs.mp4") },
      { id: "nexus", name: "NexusGS", video: assetPath("/videos/rgb/mall_12-nexus.mp4") },
      { id: "sparsegs", name: "SparseGS", video: assetPath("/videos/rgb/mall_12-sparsegs.mp4") },
    ],
  },
];

const depthScenes: ComparisonScene[] = [
  {
    id: "depth-bench-8",
    name: "Scene 01",
    oursVideo: assetPath("/videos/depth/bench_8-ours.mp4"),
    methods: [
      { id: "fsgs", name: "FSGS", video: assetPath("/videos/depth/bench_8-fsgs.mp4") },
      { id: "3dgs", name: "3DGS", video: assetPath("/videos/depth/bench_8-3dgs.mp4") },
      { id: "sparsegs", name: "SparseGS", video: assetPath("/videos/depth/bench_8-sparsegs.mp4") },
    ],
  },
  {
    id: "depth-water-8",
    name: "Scene 02",
    oursVideo: assetPath("/videos/depth/water_8-ours.mp4"),
    methods: [
      { id: "fsgs", name: "FSGS", video: assetPath("/videos/depth/water_8-fsgs.mp4") },
      { id: "sparsegs", name: "SparseGS", video: assetPath("/videos/depth/water_8-sparsegs.mp4") },
    ],
  },
];

const bibtex = `@misc{younis_evidence_gated_stabilization,
  title  = {Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting},
  author = {Younis, Tanveer and Cheng, Zhanglin}
}`;

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
};

function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section className="paper-section" id={id}>
      <div className="section-heading">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

type PaperFigureProps = {
  src: string;
  alt: string;
  caption: React.ReactNode;
  width: number;
  height: number;
  contain?: boolean;
};

function PaperFigure({
  src,
  alt,
  caption,
  width,
  height,
  contain = false,
}: PaperFigureProps) {
  return (
    <figure className={`paper-figure${contain ? " paper-figure-contain" : ""}`}>
      <div className="figure-frame">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function ResourceLinks() {
  return (
    <nav className="resource-links" aria-label="Paper resources">
      <span
        aria-disabled="true"
        title="The paper PDF is not publicly available yet"
      >
        <span className="resource-kicker">PDF</span>
        Paper
      </span>
      <span aria-disabled="true" title="Code will be released soon">
        <span className="resource-kicker">URL</span>
        <span className="resource-label">
          <span>Code</span>
          <small>Coming Soon</small>
        </span>
      </span>
      <span
        aria-disabled="true"
        title="No supplementary URL is stated in the paper"
      >
        <span className="resource-kicker">PDF</span>
        Supplementary
      </span>
    </nav>
  );
}

export default function Home() {
  return (
    <main id="top">
      <header className="paper-header content-column">
        <h1>Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting</h1>

        <div className="authors" aria-label="Authors">
          <span>
            Tanveer Younis<sup>a,b</sup>
          </span>
          <span>
            Zhanglin Cheng<sup>a,*</sup>
          </span>
        </div>

        <div className="affiliations">
          <p>
            <sup>a</sup> Shenzhen VisuCA Key Lab, Shenzhen Institutes of Advanced
            Technology, Chinese Academy of Sciences, Shenzhen 518055, China
          </p>
          <p>
            <sup>b</sup> University of Chinese Academy of Sciences, Beijing
            100049, China
          </p>
          <p className="corresponding">* Corresponding author: zl.cheng@siat.ac.cn</p>
        </div>

        <ResourceLinks />
      </header>

      <section className="hero-media wide-column" aria-label="Qualitative comparisons">
        <div className="section-heading">
          <p className="eyebrow">Results</p>
          <h2>Qualitative Comparisons</h2>
        </div>
        <p className="section-intro">
          Select a scene and baseline method, then drag the divider to compare
          synchronized RGB renderings against Ours.
        </p>
        <SceneComparison scenes={scenes} />
      </section>

      <div className="content-column">
        <Section id="abstract" title="Abstract">
          <p className="abstract-copy">
            Sparse-view 3D Gaussian Splatting can fit input images with
            primitives that appear plausible near the training trajectory but
            become floaters, billboard-like structures, or drifting geometries
            under larger viewpoint changes. We view this behavior as an
            optimization-dynamics problem: standard 3DGS applies the same
            geometry updates and densification rules to primitives that are well
            supported by multiple views and to those that are under-constrained
            by a low parallax. We propose Evidence-Gated Stabilization, which
            uses primitive-level multiview support to regulate sparse-view 3DGS
            training. From a standard sparse-view initialization, we estimated
            an Angular Support Score using scaffold-consistent visibility,
            pairwise parallax, and baseline-to-depth normalization. This score
            modulates the updates of the Gaussian position, scale, and rotation,
            restricts splitting and cloning, and guides pruning and opacity
            refinement, while leaving the appearance parameters adaptive. Our
            method reduces the influence of primitives that lack sufficient
            support. Experiments on Tanks and Temples, DL3DV-10K, and Mip-NeRF
            360 showed improved PSNR, SSIM, and LPIPS over sparse-view 3DGS
            baselines, and qualitative comparisons indicated fewer
            off-trajectory floaters and billboard-like artifacts.
          </p>
        </Section>

        <Section id="method" title="Method Overview">
          <PaperFigure
            src={assetPath("/figures/pipeline_v2.png")}
            alt="Pipeline from sparse input views and MASt3R priors through angular support, gated geometry optimization, guided topology adaptation, and fixed-topology refinement"
            width={5040}
            height={1944}
            contain
            caption={
              <>
                <strong>Overview of the proposed pipeline.</strong> We first
                constructed a dense geometric scaffold from sparse input views
                using MuSt3R priors and performed global alignment to resolve
                scale ambiguity. Next, we seed an initial Gaussian set <i>G</i>
                <sub>0</sub> and compute a continuous Angular Support Score <i>s</i>
                <sub>k</sub> from the multiview parallax. This score drives the
                Support-Gated Optimization loop, where a soft gate <i>η</i>(<i>s</i>
                <sub>k</sub>) modulates the gradient updates and restricts
                topology adaptation (splitting and pruning) to evidence-rich
                regions to suppress unreliable geometry. Finally,
                Fixed-Topology Refinement anneals opacity and appearance,
                yielding a stabilized Gaussian field <i>G</i><sup>*</sup> that
                remains robust under viewpoint deviation.
              </>
            }
          />

        </Section>

        <Section
          id="qualitative"
          eyebrow="Results"
          title="Depth Comparison"
        >
          <p className="section-intro">
            Select a scene and baseline method, then drag the divider to compare
            synchronized depth renderings against Ours.
          </p>
          <SceneComparison scenes={depthScenes} />
        </Section>

        <Section
          id="off-trajectory"
          eyebrow="Results"
          title="Off-Trajectory Comparison"
        >
          <PaperFigure
            src={assetPath("/figures/fig5.png")}
            alt="Qualitative comparison on representative off-trajectory novel views"
            width={3072}
            height={1353}
            caption={
              <>
                Qualitative comparison on off-trajectory novel views across
                Mip-NeRF 360 (top two rows, 12 training views) and DL3DV-10K
                (bottom two rows, 8 training views). Baselines exhibit distinct
                failure modes under viewpoint deviation. FSGS shows
                billboard-like stretching and foreground floaters, while CoR-GS
                exhibits background collapse and view-dependent color bleeding.
                SparseGS produces planar surface stretching as the viewpoint
                moves away from the training trajectory, and NexusGS retains
                residual blur on fine foreground structures. Our method
                produces fewer visible artifacts and more coherent structures
                in the examples shown.
              </>
            }
          />
        </Section>

        <Section
          id="near-trajectory"
          eyebrow="Results"
          title="Near-Trajectory Comparison"
        >
          <PaperFigure
            src={assetPath("/figures/fig6.png")}
            alt="Qualitative comparison of baseline methods and Ours on representative novel views"
            width={2727}
            height={842}
            caption={
              <>
                Qualitative comparison on Tanks and Temples with 4 training
                views across the Ignatius, Horse, and Barn scenes. FSGS exhibits
                foreground floaters and blurred surface boundaries, while
                CoR-GS shows view-dependent color bleeding in reflective and
                thin structures. SparseGS produces planar stretching under
                substantial viewpoint deviation, and NexusGS retains background
                blur despite improved structural coherence. Our method produces
                sharper structures and fewer visible artifacts in the examples
                shown.
              </>
            }
          />
        </Section>

        <Section id="citation" title="Citation">
          <CitationBlock value={bibtex} />
        </Section>
      </div>

      <footer className="page-footer">
        <p>Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting</p>
      </footer>
    </main>
  );
}
