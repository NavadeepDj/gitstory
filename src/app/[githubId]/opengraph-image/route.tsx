import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ githubId: string }> }
) {
    const { githubId } = await params;

    // Get query params for dynamic data
    const { searchParams } = request.nextUrl;
    const commits = searchParams.get("commits") || "0";
    const streak = searchParams.get("streak") || "0";
    const archetype = searchParams.get("archetype") || "Developer";
    const topLang = searchParams.get("lang") || "Code";
    const avatarUrl = searchParams.get("avatar") || "";

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#09090b",
                    padding: "60px",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                {/* Top bar with logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "40px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                        }}
                    >
                        {/* Logo circle */}
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                backgroundColor: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 32 32"
                                fill="none"
                            >
                                <circle cx="16" cy="16" r="15" fill="#000000" />
                                <g stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none">
                                    <path d="M11 22 L11 14 Q11 10 14 10 L22 10" />
                                    <path d="M11 17 Q11 14 14 14 L19 14" />
                                </g>
                                <circle cx="11" cy="22" r="2.5" fill="#ffffff" />
                                <circle cx="19" cy="14" r="2" fill="#ffffff" />
                                <circle cx="22" cy="10" r="2.5" fill="#ffffff" />
                            </svg>
                        </div>
                        <span
                            style={{
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "#ffffff",
                                fontStyle: "italic",
                            }}
                        >
                            GitStory
                        </span>
                    </div>
                    <span
                        style={{
                            fontSize: "24px",
                            color: "#71717a",
                            fontWeight: "300",
                        }}
                    >
                        {new Date().getFullYear()}
                    </span>
                </div>

                {/* Main content */}
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        gap: "60px",
                        alignItems: "center",
                    }}
                >
                    {/* Avatar */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                        }}
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt=""
                                width={180}
                                height={180}
                                style={{
                                    borderRadius: "50%",
                                    border: "4px solid #27272a",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "180px",
                                    height: "180px",
                                    borderRadius: "50%",
                                    backgroundColor: "#27272a",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "72px",
                                    color: "#ffffff",
                                    fontWeight: "700",
                                }}
                            >
                                {githubId[0]?.toUpperCase() || "?"}
                            </div>
                        )}
                    </div>

                    {/* User info */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                        }}
                    >
                        <span
                            style={{
                                fontSize: "20px",
                                color: "#71717a",
                                marginBottom: "8px",
                            }}
                        >
                            @{githubId}
                        </span>
                        <span
                            style={{
                                fontSize: "48px",
                                fontWeight: "700",
                                color: "#ffffff",
                                marginBottom: "12px",
                            }}
                        >
                            {archetype}
                        </span>

                        {/* Stats row */}
                        <div
                            style={{
                                display: "flex",
                                gap: "40px",
                                marginTop: "24px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: "#71717a",
                                        textTransform: "uppercase",
                                        letterSpacing: "2px",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Commits
                                </span>
                                <span
                                    style={{
                                        fontSize: "36px",
                                        fontWeight: "700",
                                        color: "#22d3ee",
                                    }}
                                >
                                    {commits}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: "#71717a",
                                        textTransform: "uppercase",
                                        letterSpacing: "2px",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Streak
                                </span>
                                <span
                                    style={{
                                        fontSize: "36px",
                                        fontWeight: "700",
                                        color: "#f97316",
                                    }}
                                >
                                    {streak} days
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: "#71717a",
                                        textTransform: "uppercase",
                                        letterSpacing: "2px",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Top Language
                                </span>
                                <span
                                    style={{
                                        fontSize: "36px",
                                        fontWeight: "700",
                                        color: "#a855f7",
                                    }}
                                >
                                    {topLang}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "40px",
                        paddingTop: "24px",
                        borderTop: "1px solid #27272a",
                    }}
                >
                    <span
                        style={{
                            fontSize: "18px",
                            color: "#71717a",
                        }}
                    >
                        Every commit tells a story
                    </span>
                    <span
                        style={{
                            fontSize: "18px",
                            color: "#52525b",
                        }}
                    >
                        gitstory.sitestash.org
                    </span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
