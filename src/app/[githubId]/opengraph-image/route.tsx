import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { fetchUserStory } from "@/services/githubService";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ githubId: string }> }
) {
  const { githubId } = await params;

  // Fetch real user data
  let commits = "0";
  let archetype = "Developer";
  let topLang = "Code";
  let avatarUrl = "";
  let topRepo = "";
  let topRepoStars = 0;
  let velocityData: number[] = [];

  try {
    const data = await fetchUserStory(githubId);
    commits = data.totalCommits?.toLocaleString() || "0";
    archetype = data.archetype || "Developer";
    topLang = data.topLanguages?.[0]?.name || "Code";
    avatarUrl = data.avatarUrl || "";
    topRepo = data.topRepo?.name || "";
    topRepoStars = data.topRepo?.stars || 0;

    // Build velocity data for the mini chart
    if (data.velocityData?.length) {
      const daysPerMonth = Math.ceil(data.velocityData.length / 12);
      for (let i = 0; i < data.velocityData.length; i += daysPerMonth) {
        const monthCommits = data.velocityData
          .slice(i, i + daysPerMonth)
          .reduce((sum, d) => sum + d.commits, 0);
        velocityData.push(monthCommits);
      }
    }
  } catch (error) {
    console.error("Failed to fetch user data for OG image:", error);
  }

  const maxVelocity = Math.max(...velocityData, 1);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#09090b",
          padding: "48px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Card Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            backgroundColor: "#18181b",
            borderRadius: "32px",
            padding: "40px",
            border: "1px solid #27272a",
            position: "relative",
          }}
        >
          {/* Header: Avatar + Logo */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "24px",
            }}
          >
            {/* Avatar */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                width={80}
                height={80}
                style={{
                  borderRadius: "50%",
                  border: "3px solid #27272a",
                }}
              />
            ) : (
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#27272a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  color: "#ffffff",
                  fontWeight: "700",
                }}
              >
                {githubId[0]?.toUpperCase() || "?"}
              </div>
            )}

            {/* Logo */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "#ffffff",
                  fontStyle: "italic",
                }}
              >
                GitStory
              </span>
              <span
                style={{
                  fontSize: "20px",
                  color: "#71717a",
                  fontWeight: "300",
                }}
              >
                {new Date().getFullYear()}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#27272a",
              marginBottom: "24px",
            }}
          />

          {/* Main Content: Starring + Stats Grid */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {/* Starring Section */}
            <div
              style={{
                marginBottom: "28px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#71717a",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  marginBottom: "8px",
                }}
              >
                STARRING
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "42px",
                    fontWeight: "700",
                    color: "#ffffff",
                    lineHeight: 1.1,
                  }}
                >
                  @{githubId}
                </span>
                <span
                  style={{
                    fontSize: "28px",
                    fontStyle: "italic",
                    color: "#4ade80",
                    marginTop: "4px",
                  }}
                >
                  {archetype}
                </span>
              </div>
            </div>

            {/* 2x2 Stats Grid */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "24px",
                flex: 1,
              }}
            >
              {/* Commits */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "45%",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#71717a",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    marginBottom: "6px",
                  }}
                >
                  COMMITS
                </span>
                <span
                  style={{
                    fontSize: "32px",
                    fontStyle: "italic",
                    color: "#ffffff",
                  }}
                >
                  {commits}
                </span>
              </div>

              {/* Top Language */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "45%",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#71717a",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    marginBottom: "6px",
                  }}
                >
                  TOP LANGUAGE
                </span>
                <span
                  style={{
                    fontSize: "32px",
                    fontStyle: "italic",
                    color: "#ffffff",
                  }}
                >
                  {topLang}
                </span>
              </div>

              {/* Top Project */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "45%",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#71717a",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    marginBottom: "6px",
                  }}
                >
                  TOP PROJECT
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontSize: "26px",
                      fontStyle: "italic",
                      color: "#ffffff",
                    }}
                  >
                    {topRepo || "🔒 Secret"}
                  </span>
                  {topRepoStars > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "6px",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>⭐</span>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#a1a1aa",
                        }}
                      >
                        {topRepoStars.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Mini Graph */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "45%",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#71717a",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    marginBottom: "6px",
                  }}
                >
                  ACTIVITY
                </span>
                {/* Velocity Bars */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    height: "40px",
                    gap: "4px",
                  }}
                >
                  {velocityData.slice(0, 12).map((commits, i) => {
                    const height = Math.max(8, (commits / maxVelocity) * 40);
                    const opacity =
                      commits > 0 ? 0.5 + (commits / maxVelocity) * 0.5 : 0.2;
                    return (
                      <div
                        key={i}
                        style={{
                          width: "18px",
                          height: `${height}px`,
                          backgroundColor: `rgba(59, 130, 246, ${opacity})`,
                          borderRadius: "3px",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Divider */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#27272a",
              marginTop: "20px",
              marginBottom: "16px",
            }}
          />

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Velocity bars as mini chart */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                height: "32px",
                gap: "3px",
              }}
            >
              {velocityData.slice(0, 12).map((commits, i) => {
                const height = Math.max(6, (commits / maxVelocity) * 32);
                const opacity =
                  commits > 0 ? 0.4 + (commits / maxVelocity) * 0.6 : 0.15;
                return (
                  <div
                    key={i}
                    style={{
                      width: "14px",
                      height: `${height}px`,
                      backgroundColor: `rgba(147, 51, 234, ${opacity})`,
                      borderRadius: "2px",
                    }}
                  />
                );
              })}
            </div>

            {/* Domain */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" fill="#000000" />
                  <g
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  >
                    <path d="M11 22 L11 14 Q11 10 14 10 L22 10" />
                    <path d="M11 17 Q11 14 14 14 L19 14" />
                  </g>
                  <circle cx="11" cy="22" r="2" fill="#ffffff" />
                  <circle cx="19" cy="14" r="1.5" fill="#ffffff" />
                  <circle cx="22" cy="10" r="2" fill="#ffffff" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "14px",
                  color: "#71717a",
                }}
              >
                gitstory.sitestash.org
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
