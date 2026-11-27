// An outlined tube: a thick forest line with a thinner ivory line inside it.
const Limb = ({ d }) => (
  <>
    <path d={d} fill="none" strokeWidth="9.5" />
    <path d={d} fill="none" stroke="#F0EBDD" strokeWidth="4.5" />
  </>
)

const Flame = ({ x }) => (
  <g className="robot-flame">
    <path d={`M${x - 5.5} 119c0 7 5.5 9 5.5 17 0-8 5.5-10 5.5-17z`} fill="#7BC6A4" />
    <path d={`M${x - 2.5} 119c0 4 2.5 5.5 2.5 9.5 0-4 2.5-5.5 2.5-9.5z`} fill="#F0EBDD" />
  </g>
)

/** Original Novix robot: ivory body, jade details, forest outlines. index.css animates the parts by class name. */
export default function RobotArt({ className = '' }) {
  return (
    <svg viewBox="0 0 100 124" className={className} aria-hidden="true" focusable="false">
      <ellipse className="robot-shadow" cx="50" cy="121" rx="27" ry="2.6" fill="#183A2C" opacity=".16" />
      <g className="robot-figure" stroke="#183A2C" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
        {/* an invisible shape under the drawing, so the whole robot is one easy thing to click */}
        <rect className="robot-hit" x="18" y="22" width="64" height="98" rx="18" fill="transparent" stroke="none" />

        {/* little rocket flames, shown only while it flies */}
        <g className="robot-flames" stroke="none">
          <Flame x={40} />
          <Flame x={60} />
        </g>

        {/* legs and feet */}
        <g className="robot-leg robot-leg-left">
          <rect x="36" y="103" width="10" height="12" rx="4" fill="#F0EBDD" />
          <rect x="31" y="112" width="18" height="8" rx="4" fill="#7BC6A4" />
        </g>
        <g className="robot-leg robot-leg-right">
          <rect x="54" y="103" width="10" height="12" rx="4" fill="#F0EBDD" />
          <rect x="51" y="112" width="18" height="8" rx="4" fill="#7BC6A4" />
        </g>

        {/* left arm */}
        <g className="robot-arm-left">
          <Limb d="M30 82C22 84 18 90 18 96" />
          <circle cx="18" cy="98" r="5.5" fill="#7BC6A4" />
        </g>

        {/* body with the Novix N */}
        <rect x="27" y="73" width="46" height="34" rx="13" fill="#F0EBDD" />
        <path d="M68.5 78c2.200 2 3.200 4.500 3.200 8v8c0 6-3.700 10.500-9.700 11.700 3.700-2.700 5.700-6.700 5.700-11.7v-9c0-2.700 0-5 .8-7z" fill="#C6D6CB" stroke="none" />
        <rect x="40" y="82" width="20" height="17" rx="5.500" fill="#7BC6A4" />
        <path d="M45.500 94.500v-8l9 8v-8" fill="none" strokeWidth="2.400" />
        <rect x="43" y="67" width="14" height="8" rx="3" fill="#7BC6A4" />

        {/* head: .robot-head plays the tilt, .robot-lean follows the pointer */}
        <g className="robot-head">
          <g className="robot-lean">
            <path d="M50 22v-8" fill="none" />
            <circle className="robot-bulb" cx="50" cy="10" r="5" fill="#7BC6A4" />
            <rect x="12.500" y="35" width="9" height="19" rx="4.500" fill="#7BC6A4" />
            <rect x="78.500" y="35" width="9" height="19" rx="4.500" fill="#7BC6A4" />
            <rect x="19" y="21" width="62" height="48" rx="19" fill="#F0EBDD" />
            <path d="M72 26.500c4.800 3.500 7.600 8.500 7.600 14.500v8c0 10.500-7.600 18.700-18.600 18.700 7.600-3.700 11-10.200 11-18.700z" fill="#C6D6CB" stroke="none" />
            <g className="robot-eyes">
              <circle cx="37" cy="43" r="9" fill="#FFFDF6" />
              <circle cx="63" cy="43" r="9" fill="#FFFDF6" />
              <g className="robot-pupils" stroke="none">
                <circle cx="37" cy="43.500" r="4.700" fill="#183A2C" />
                <circle cx="63" cy="43.500" r="4.700" fill="#183A2C" />
                <circle cx="38.800" cy="41.600" r="1.700" fill="#FFFDF6" />
                <circle cx="64.800" cy="41.600" r="1.700" fill="#FFFDF6" />
              </g>
            </g>
            {/* closed, smiling eyes for the goodbye */}
            <path className="robot-happy" d="M30 45.500c3-6.500 11-6.500 14 0M56 45.500c3-6.500 11-6.500 14 0" fill="none" strokeWidth="3" />
            {/* closed eyes, resting, while it naps */}
            <path className="robot-sleep-eyes" d="M30 43c3 5.500 11 5.500 14 0M56 43c3 5.500 11 5.500 14 0" fill="none" strokeWidth="3" />
            {/* spiral eyes, turned over the white of each eye when it is dizzy */}
            <g className="robot-spirals" fill="none" strokeWidth="1.800">
              <g className="robot-spiral robot-spiral-left">
                <circle cx="37" cy="43" r="7.600" fill="#FFFDF6" stroke="none" />
                <path d="M37 43a1.300 1.300 0 0 1 2.600 0a2.600 2.600 0 0 1-5.200 0a3.900 3.900 0 0 1 7.800 0a5.200 5.200 0 0 1-10.400 0" />
              </g>
              <g className="robot-spiral robot-spiral-right">
                <circle cx="63" cy="43" r="7.600" fill="#FFFDF6" stroke="none" />
                <path d="M63 43a1.300 1.300 0 0 1 2.600 0a2.600 2.600 0 0 1-5.200 0a3.900 3.900 0 0 1 7.800 0a5.200 5.200 0 0 1-10.400 0" />
              </g>
            </g>
            <g fill="#7BC6A4" stroke="none" opacity=".65">
              <circle cx="28.500" cy="57" r="3.400" />
              <circle cx="71.500" cy="57" r="3.400" />
            </g>
            <path className="robot-smile" d="M42 58c4.500 4.500 11.500 4.500 16 0" fill="none" />
            <path className="robot-grin" d="M41 56.500h18c0 6-4 9.500-9 9.500s-9-3.500-9-9.500z" fill="#183A2C" />
            <ellipse className="robot-yawn" cx="50" cy="60.500" rx="5.500" ry="6" fill="#183A2C" />
            <circle className="robot-snore" cx="50" cy="60" r="2.800" fill="#183A2C" />
            <path className="robot-dizzy-mouth" d="M41 60q2.250-3.500 4.500 0t4.500 0t4.500 0t4.500 0" fill="none" />

            {/* peekaboo: hands over its eyes, which swing aside (around the shoulders) for "boo!" */}
            <g className="robot-peek">
              <g className="robot-peek-left">
                <Limb d="M30 82C20 72 23 55 33 49" />
                <circle cx="37" cy="44" r="10" fill="#7BC6A4" />
                <path d="M32.500 39.500v5.500M37 37.500v6.500M41.500 39.500v5.500" fill="none" strokeWidth="1.500" />
              </g>
              <g className="robot-peek-right">
                <Limb d="M70 82C80 72 77 55 67 49" />
                <circle cx="63" cy="44" r="10" fill="#7BC6A4" />
                <path d="M58.500 39.500v5.500M63 37.500v6.500M67.500 39.500v5.500" fill="none" strokeWidth="1.500" />
              </g>
            </g>
          </g>
        </g>

        {/* waving arm, drawn last so a raised hand passes in front */}
        <g className="robot-arm">
          <Limb d="M70 82c8 2 12 8 12 14" />
          <circle cx="82" cy="98" r="5.500" fill="#7BC6A4" />
        </g>
      </g>

      {/* "z z z" while it naps: inside the drawing's own box, so it never reaches over the page */}
      <g className="robot-zzz" fill="none" stroke="#183A2C" strokeWidth="2.200" strokeLinejoin="round" strokeLinecap="round">
        <path className="robot-z" d="M79 25h4.500l-4.500 5h4.500" />
        <path className="robot-z" d="M84 13.500h5.500l-5.500 6h5.500" />
        <path className="robot-z" d="M89 1.500h6.500l-6.500 7h6.500" />
      </g>
    </svg>
  )
}
