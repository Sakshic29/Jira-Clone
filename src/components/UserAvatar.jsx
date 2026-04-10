// export default function UserAvatar({ user, size = "md", showName = false }) {
//   const sizes = {
//     sm: { circle: "w-6 h-6",   font: "9px"  },
//     md: { circle: "w-8 h-8",   font: "11px" },
//     lg: { circle: "w-10 h-10", font: "13px" },
//   };

//   const s = sizes[size] ?? sizes.md;

//   if (!user) {
//     return (
//       <div className={`${s.circle} rounded-full bg-gray-100 border-2 border-dashed border-gray-300 shrink-0`} />
//     );
//   }

//   return (
//     <div className="flex items-center gap-2">
//       <div
//         className={`${s.circle} rounded-full flex items-center justify-center text-white font-semibold shrink-0 select-none`}
//         style={{ backgroundColor: user.color, fontSize: s.font }}
//         title={user.name}
//       >
//         {user.initials}
//       </div>
//       {showName && (
//         <span className="text-sm text-gray-600 font-medium">{user.name}</span>
//       )}
//     </div>
//   );
// }
const GRADIENTS = [
  ["#6366f1", "#8b5cf6"],
  ["#0ea5e9", "#2dd4bf"],
  ["#f97316", "#f43f5e"],
  ["#10b981", "#0ea5e9"],
  ["#f59e0b", "#ef4444"],
  ["#ec4899", "#8b5cf6"],
];

function getGradient(name = "") {
  const i = name.charCodeAt(0) % GRADIENTS.length;
  const [a, b] = GRADIENTS[i];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

const sizes = {
  xs: { px: 28, font: 10 },
  sm: { px: 36, font: 12 },
  md: { px: 44, font: 14 },
  lg: { px: 56, font: 17 },
  xl: { px: 72, font: 22 },
};

export default function UserAvatar({
  user,
  size = "md",
  showName = false,
  role = null,
  status = null,   // "online" | "away" | "offline"
  ring = false,
}) {
  const s = sizes[size] ?? sizes.md;

  const statusColor = { online: "#22c55e", away: "#f59e0b", offline: "#9ca3af" };

  const circle = (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width: s.px, height: s.px,
          borderRadius: "50%",
          background: user ? getGradient(user.name) : "var(--color-background-secondary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: s.font, fontWeight: 500, color: "#fff",
          userSelect: "none",
          border: user ? "none" : "1.5px dashed var(--color-border-secondary)",
        }}
        title={user?.name}
      >
        {user ? user.initials : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="var(--color-text-secondary)" strokeWidth="1.5"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      {status && (
        <span style={{
          position: "absolute", bottom: 0, right: 0,
          width: 10, height: 10, borderRadius: "50%",
          background: statusColor[status],
          border: "2px solid var(--color-background-primary)",
        }}/>
      )}
    </div>
  );

  const wrapped = ring ? (
    <div style={{
      padding: 3, borderRadius: "50%",
      border: `2px solid ${GRADIENTS[(user?.name.charCodeAt(0) ?? 0) % GRADIENTS.length][0]}`,
    }}>
      {circle}
    </div>
  ) : circle;

  if (!showName) return wrapped;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {wrapped}
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{user?.name ?? "Unassigned"}</p>
        {role && <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{role}</p>}
      </div>
    </div>
  );
}