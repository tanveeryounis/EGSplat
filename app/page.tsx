import type { Metadata } from "next";
import {
  CitationBlock,
  MediaComparison,
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
    id: "ignatius",
    name: "Ignatius",
    leftImage: assetPath("/figures/ignatius-fsgs.png"),
    rightImage: assetPath("/figures/ignatius-ours.png"),
  },
  {
    id: "horse",
    name: "Horse",
    leftImage: assetPath("/figures/horse-fsgs.png"),
    rightImage: assetPath("/figures/horse-ours.png"),
  },
  {
    id: "barn",
    name: "Barn",
    leftImage: assetPath("/figures/barn-fsgs.png"),
    rightImage: assetPath("/figures/barn-ours.png"),
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
      <a href={assetPath("/paper.pdf")} target="_blank" rel="noreferrer">
        <span className="resource-kicker">PDF</span>
        Paper
      </a>
      <span aria-disabled="true" title="No code URL is stated in the paper">
        <span className="resource-kicker">URL</span>
        Code
      </span>
      <span
        aria-disabled="true"
        title="No supplementary URL is stated in the paper"
      >
        <span className="resource-kicker">PDF</span>
        Supplementary
      </span>
      <a href="#top">
        <span className="resource-kicker">WEB</span>
        Project
      </a>
    </nav>
  );
}

function MetricCard({
  dataset,
  views,
  psnr,
  ssim,
  lpips,
}: {
  dataset: string;
  views: string;
  psnr: string;
  ssim: string;
  lpips: string;
}) {
  return (
    <article className="metric-card">
      <div>
        <h3>{dataset}</h3>
        <p>{views}</p>
      </div>
      <dl>
        <div>
          <dt>PSNR</dt>
          <dd>{psnr}</dd>
        </div>
        <div>
          <dt>SSIM</dt>
          <dd>{ssim}</dd>
        </div>
        <div>
          <dt>LPIPS</dt>
          <dd>{lpips}</dd>
        </div>
      </dl>
    </article>
  );
}

export default function Home() {
  return (
    <main id="top">
      <header className="paper-header content-column">
        <p className="paper-label">Academic project page</p>
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

      <section className="hero-media wide-column" aria-label="Hero comparison">
        <MediaComparison
          leftLabel="FSGS"
          rightLabel="Ours"
          leftImage={assetPath("/figures/ignatius-fsgs.png")}
          rightImage={assetPath("/figures/ignatius-ours.png")}
          leftPoster={assetPath("/figures/ignatius-fsgs.png")}
          rightPoster={assetPath("/figures/ignatius-ours.png")}
          eager
        />
        <p className="hero-caption">
          Tanks and Temples, Ignatius, 4 training views. Drag to compare the
          paper-native FSGS and Ours panels from Figure 9.
        </p>
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

        <Section id="method" eyebrow="Approach" title="Method overview">
          <div className="prose-stack">
            <p>
              Sparse-view 3DGS is unstable because the photometric gradients are
              not equally reliable for all Gaussian primitives. In regions with
              sufficient multiview parallax, photometric updates can provide
              useful geometric guidance. However, in weakly observed or
              low-parallax regions, the same updates may move, flatten, densify,
              or preserve primitives in ways that reduce training-view error but
              yield unstable geometry under novel viewpoints. The standard 3DGS
              applies the same geometry update and topology growth rules in both
              cases.
            </p>
            <p>
              We propose Evidence-Gated Stabilization, a training-time framework
              that uses primitive-level multiview support as an explicit control
              signal. In our evaluated pipeline, MASt3R provides the camera
              parameters and a coarse per-view geometric scaffold. Following
              global alignment, this scaffold is used to initialize the Gaussian
              set G<sub>0</sub>. We use the resulting geometry to estimate the
              support of each primitive and regulate its motion, growth, and
              persistence during optimization. Our experiments establish the
              method only under this MASt3R-derived initialization;
              compatibility with other scaffold providers is not evaluated.
            </p>
          </div>

          <PaperFigure
            src={assetPath("/figures/method-overview.png")}
            alt="Pipeline from sparse input views and MASt3R priors through angular support, gated geometry optimization, guided topology adaptation, and fixed-topology refinement"
            width={1545}
            height={591}
            contain
            caption={
              <>
                <strong>Figure 2.</strong> Starting from a standard sparse-view
                initialization, coarse scaffold depths and input cameras produce
                a primitive-level Angular Support Score s<sub>k</sub>. The score
                controls geometry update gating, support-aware topology
                adaptation, and fixed-topology opacity refinement.
              </>
            }
          />

          <div className="method-steps" aria-label="Method stages">
            <article>
              <span>01</span>
              <h3>Angular support</h3>
              <p>
                Compute s<sub>k</sub> from scaffold-consistent visibility,
                pairwise angular parallax, and baseline-to-depth normalization.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Geometry gating</h3>
              <p>
                Gate position, scale, and rotation updates while leaving
                appearance parameters adaptive.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Guided topology</h3>
              <p>
                Restrict splitting and cloning in weakly supported regions and
                prune low-opacity primitives with persistently low support.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Fixed-topology refinement</h3>
              <p>
                Attenuate the opacity of primitives that remain weakly supported
                over time.
              </p>
            </article>
          </div>
          <p className="source-note">
            The support score is a soft reliability estimate and not a proof of
            physical correctness.
          </p>
        </Section>

        <Section
          id="qualitative"
          eyebrow="Results"
          title="Interactive qualitative comparisons"
        >
          <p className="section-intro">
            Tanks and Temples with 4 training views. Select an off-trajectory
            scene and drag the divider to compare the paper's FSGS and Ours
            panels.
          </p>
          <SceneComparison scenes={scenes} />

          <div className="metrics-heading">
            <p className="eyebrow">Table I</p>
            <h3>Quantitative results for Ours</h3>
          </div>
          <div className="metric-grid">
            <MetricCard
              dataset="Tanks and Temples"
              views="4 views"
              psnr="19.85"
              ssim="0.865"
              lpips="0.155"
            />
            <MetricCard
              dataset="DL3DV-10K"
              views="8 views"
              psnr="22.44"
              ssim="0.721"
              lpips="0.263"
            />
            <MetricCard
              dataset="Mip-NeRF 360"
              views="12 views"
              psnr="20.17"
              ssim="0.739"
              lpips="0.273"
            />
          </div>

          <PaperFigure
            src={assetPath("/figures/unified-off-trajectory.jpg")}
            alt="Unified off-trajectory comparison across Mip-NeRF 360 and DL3DV-10K"
            width={1570}
            height={691}
            caption={
              <>
                <strong>Figure 8.</strong> Unified qualitative comparison on
                off-trajectory novel views across Mip-NeRF 360 (top two rows, 12
                training views) and DL3DV-10K (bottom two rows, 8 training
                views). Perceptual quality is quantified in Table II of the
                paper.
              </>
            }
          />
        </Section>

        <Section id="rgb-depth" eyebrow="Geometry" title="RGB and depth comparison">
          <PaperFigure
            src={assetPath("/figures/rgb-depth.jpg")}
            alt="Novel-view RGB renderings and accumulated depth maps comparing FSGS, SparseGS, NexusGS, and Ours"
            width={767}
            height={436}
            caption={
              <>
                <strong>Figure 5.</strong> Novel-view RGB renderings and
                accumulated depth maps on DL3DV-10K under sparse inputs. FSGS,
                SparseGS, and NexusGS produce plausible RGB appearances, but
                their rendered depth maps show floating artifacts and blurred
                depth boundaries that intensify under viewpoint deviation. Our
                method yields cleaner rendered depth with sharper discontinuities
                and fewer visible floaters in this example, suggesting improved
                stability beyond appearance fitting.
              </>
            }
          />
        </Section>

        <Section
          id="viewpoint"
          eyebrow="Stability analysis"
          title="Viewpoint-deviation results"
        >
          <div className="viewpoint-layout">
            <PaperFigure
              src={assetPath("/figures/viewpoint-deviation.jpg")}
              alt="PSNR plotted against viewpoint deviation angle from 0 to 45 degrees for seven methods"
              width={767}
              height={415}
              caption={
                <>
                  <strong>Figure 7.</strong> PSNR as a function of angular
                  deviation from the nearest training view. The dashed line
                  denotes the 15 degree near/off-trajectory threshold. Our method
                  degrades more gradually as viewpoint deviation increases.
                </>
              }
            />
            <aside className="deviation-callouts" aria-label="Annotated margins">
              <div>
                <span>15 degrees</span>
                <strong>+0.65 dB</strong>
              </div>
              <div>
                <span>45 degrees</span>
                <strong>+1.10 dB</strong>
              </div>
              <p>
                Exact visual margins annotated in Figure 7. Off-trajectory poses
                deviate more than 15 degrees from the nearest training camera.
              </p>
            </aside>
          </div>
        </Section>

        <Section id="ablation" eyebrow="Analysis" title="Ablation results">
          <PaperFigure
            src={assetPath("/figures/ablation.jpg")}
            alt="RGB and depth ablation comparing the baseline, support-gated optimization, and the full method"
            width={767}
            height={324}
            caption={
              <>
                <strong>Figure 6.</strong> The baseline suffers from
                billboard-like artifacts and geometric distortions.
                Support-gated optimization sharpens RGB rendering but retains
                high-frequency floaters in the depth map. Evidence-Guided
                Topology restricts density to verified regions, suppresses
                floaters, and stabilizes geometry.
              </>
            }
          />

          <div className="table-block">
            <div className="table-title">
              <div>
                <p className="eyebrow">Table III</p>
                <h3>Component ablation on Mip-NeRF 360</h3>
              </div>
              <span>12 views</span>
            </div>
            <div className="table-scroll" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Configuration</th>
                    <th scope="col">PSNR</th>
                    <th scope="col">SSIM</th>
                    <th scope="col">LPIPS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Baseline (MASt3R Scaffold + Vanilla 3DGS)</th>
                    <td>18.11</td>
                    <td>0.514</td>
                    <td>0.497</td>
                  </tr>
                  <tr>
                    <th scope="row">+ Support-Gated Opt.</th>
                    <td>19.33</td>
                    <td>0.639</td>
                    <td>0.360</td>
                  </tr>
                  <tr className="highlight-row">
                    <th scope="row">+ Evidence-Guided Topo. (Ours)</th>
                    <td>20.17</td>
                    <td>0.739</td>
                    <td>0.273</td>
                  </tr>
                  <tr>
                    <th scope="row">sₖ without resolution-confidence (sin θ only)</th>
                    <td>19.66</td>
                    <td>0.706</td>
                    <td>0.307</td>
                  </tr>
                  <tr>
                    <th scope="row">Strict isotropy (κ = 1) instead of κ = 4</th>
                    <td>19.52</td>
                    <td>0.698</td>
                    <td>0.318</td>
                  </tr>
                  <tr>
                    <th scope="row">Global gating (geometry + appearance)</th>
                    <td>19.74</td>
                    <td>0.713</td>
                    <td>0.298</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="ablation-summary">
            <article>
              <span>Full method vs. baseline</span>
              <strong>+2.06 dB</strong>
            </article>
            <article>
              <span>Support gating LPIPS</span>
              <strong>0.497 → 0.360</strong>
            </article>
            <article>
              <span>Guided topology LPIPS</span>
              <strong>0.360 → 0.273</strong>
            </article>
          </div>
        </Section>

        <Section id="citation" title="Citation / BibTeX">
          <p className="citation-note">
            The supplied manuscript does not state a venue, publication year,
            DOI, or paper-native BibTeX entry. This minimal citation includes
            only metadata stated in the PDF.
          </p>
          <CitationBlock value={bibtex} />
        </Section>
      </div>

      <footer className="page-footer">
        <p>Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting</p>
      </footer>
    </main>
  );
}
