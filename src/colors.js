export function changeColorLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = "#",
        c,
        i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

export function getUnitColorProperty(parts) {
    const unitColorStyle = [
        "match",
        ["feature-state", "color"],
        ...parts
            .map(part => [part.id, part.color])
            .reduce((list, pair) => [...list, ...pair]),
        "rgba(0, 0, 0, 0)"
    ];

    const hoveredUnitColorStyle = [
        "match",
        ["feature-state", "color"],
        ...parts
            .map(part => [part.id, part.hoverColor])
            .reduce((list, pair) => [...list, ...pair]),
        "#aaaaaa"
    ];

    const unitColorProperty = [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        hoveredUnitColorStyle,
        unitColorStyle
    ];

    return unitColorProperty;
}

function colorAndHoverAlt(hex) {
  return [
    "case",
    ["==", ["feature-state", "hover"], true],
    changeColorLuminance(hex, -0.3),
    hex
  ]
}

export const incomeColors = ["case",
  ["<", ["get", "B19013_001"], 30000],
  colorAndHoverAlt("#edf8fb"),
  ["<", ["get", "B19013_001"], 60000],
  colorAndHoverAlt("#ccece6"),
  ["<", ["get", "B19013_001"], 90000],
  colorAndHoverAlt("#99d8c9"),
  ["<", ["get", "B19013_001"], 120000],
  colorAndHoverAlt("#66c2a4"),
  ["<", ["get", "B19013_001"], 150000],
  colorAndHoverAlt("#2ca25f"),
  colorAndHoverAlt("#006d2c")
]

export const ageColors = ["case",
  ["<", ["get", "B01002_001"], 20],
  colorAndHoverAlt("#edf8fb"),
  ["<", ["get", "B01002_001"], 35],
  colorAndHoverAlt("#ccece6"),
  ["<", ["get", "B01002_001"], 50],
  colorAndHoverAlt("#99d8c9"),
  ["<", ["get", "B01002_001"], 65],
  colorAndHoverAlt("#66c2a4"),
  ["<", ["get", "B01002_001"], 80],
  colorAndHoverAlt("#2ca25f"),
  colorAndHoverAlt("#006d2c"),
]

const partyRGBColors = {
  Democratic: [
    0, "rgba(0,0,0,0)",
    0.499, "rgba(0,0,0,0)",
    0.5, "rgba(249,249,249,0)",
    1, "rgb(25, 118, 210)" // 0x1976d2
  ],
  Democratic_hover: [
    0, "rgba(0,0,0,0)",
    0.499, "rgba(0,0,0,0)",
    0.5, "rgba(174,174,174,0.5)",
    1, "rgb(18, 83, 147)"
  ],
  Republican: [
    0, "rgba(0,0,0,0)",
    0.499, "rgba(0,0,0,0)",
    0.5, "rgba(249,249,249,0)",
    1, "rgb(211, 47, 47)" // 0xd32f2f
  ],
  Republican_hover: [
    0, "rgba(0,0,0,0)",
    0.499, "rgba(0,0,0,0)",
    0.5, "rgba(174,174,174,0.5)",
    1, "rgb(148, 33, 33)"
  ],
};

export function densityColors(demoGroup) {
  return ["case",
    ["==", ["get", "TOTPOP"], 0],
      "#ccc", // no data
      [
        "interpolate",
        ["linear"],
        ["/", ["get", demoGroup[1]], ["get", "TOTPOP"]],
        ...[0, "rgba(200, 200, 255, 0)",
        (demoGroup[2] + 0.01), "rgba(0, 0, 255, 0.6)"]
      ]
  ]
}

export function electionColors(demKey, repKey) {
  return [
    "case",
    [">", ["get", demKey], ["get", repKey]],
      ["case",
        ["==", ["feature-state", "hover"], true],
        [
            "interpolate",
            ["linear"],
            ["/", ["get", demKey], ["+", ["get", demKey], ["get", repKey]]],
            ...partyRGBColors["Democratic_hover"],
        ],
        [
            "interpolate",
            ["linear"],
            ["/", ["get", demKey], ["+", ["get", demKey], ["get", repKey]]],
            ...partyRGBColors["Democratic"],
        ]
      ],
      ["case",
        ["==", ["feature-state", "hover"], true],
        [
            "interpolate",
            ["linear"],
            ["/", ["get", repKey], ["+", ["get", demKey], ["get", repKey]]],
            ...partyRGBColors["Republican_hover"],
        ],
        [
            "interpolate",
            ["linear"],
            ["/", ["get", repKey], ["+", ["get", demKey], ["get", repKey]]],
            ...partyRGBColors["Republican"],
        ]
      ]
  ]
}

export const enviroPaint = {
  'circle-radius': 4,
  'circle-color': [
    'match',
    ['get', 'CLASS_STATUS'],
    'Title V', 'purple',
    'Synthetic Minor', 'green',
    'Small', 'red',
    'Permit Exempt', 'blue',
    'Registered', 'orange',
    'Permit/Registration Pending', 'yellow',
    '#ccc' // other
  ]
}
