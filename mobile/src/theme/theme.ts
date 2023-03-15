// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { extendTheme } from "native-base";

export const customTheme = extendTheme({
  colors: {
    // primary background color
    primary: {
      100: "#f4f6f8",
      200: "#e4f5ff",
      500: "#189ad8",
      900: "#09374e",
    },
    error: {
      500: "#e61818",
    },
    info: {
      500: "#0fb6dd",
    },
    success: {
      500: "#47c869",
    },
    warning: {
      500: "#ffdb66",
    },
  },
  components: {
    Button: {
      defaultProps: {
        _icon: {
          color: "primary.500",
          mr: 1,
        },
        borderColor: "primary.500",
        rounded: "sm",
      },
      sizes: {
        md: {
          px: "4",
          py: "4",
          _text: {
            fontSize: "md",
          },
        },
      },
      variants: {
        solid: {
          background: "primary.500",
        },
        outline: {
          background: "white",
          _text: { color: "black" },
        },
      },
    },
    Checkbox: {
      defaultProps: {
        size: "md",
        borderWidth: 1,
        _checked: {
          bg: "primary.200",
        },
        _icon: {
          color: "primary.500",
        },
      },
    },
    FormControlHelperText: {
      baseStyle: {
        _invalid: { color: "error.500" },
      },
    },
    FormControlLabel: {
      baseStyle: {
        _invalid: { _text: { color: "error.500" } },
      },
      defaultProps: {
        _astrick: {
          color: "transparent",
        },
      },
    },
    Input: {
      baseStyle: {
        height: "60px",
        backgroundColor: "white",
        _invalid: {
          _focus: {
            bgColor: "error.100",
            borderColor: "error.600",
          },
        },
      },
      defaultProps: {
        rounded: "lg",
      },
    },
    PopoverArrow: {
      baseStyle: {
        borderColor: "primary.500",
      },
    },
    PopoverBody: {
      baseStyle: {
        p: 4,
        _text: {
          lineHeight: "md",
        },
      },
    },
    PopoverContent: {
      baseStyle: {
        m: 4,
        borderColor: "primary.500",
      },
    },
    PopoverCloseButton: {
      baseStyle: {
        top: 1,
        right: 1,
        p: 4,
        _icon: {
          size: 4,
        },
      },
    },
    PopoverFooter: {
      baseStyle: {
        p: 4,
        shadow: 0,
        borderTopWidth: 0,
      },
    },
    PopoverHeader: {
      baseStyle: {
        p: 4,
        _text: {
          letterSpacing: "-0.4px",
        },
      },
    },
    Select: {
      baseStyle: {
        _customDropdownIconProps: {
          size: 3,
          mr: 4,
        },
      },
    },
  },
  fontConfig: {
    Lato: {
      100: {
        normal: "Lato-Light",
      },
      200: {
        normal: "Lato-Light",
      },
      300: {
        normal: "Lato-Light",
      },
      400: {
        normal: "Lato-Regular",
      },
      500: {
        normal: "Lato-Bold",
      },
      600: {
        normal: "Lato-Bold",
      },
    },
  },
  fonts: {
    heading: "Lato",
    body: "Lato",
    mono: "Lato",
  },
});

// 2. Get the type of the CustomTheme
type CustomThemeType = typeof customTheme;

// 3. Extend the internal NativeBase Theme
declare module "native-base" {
  type ICustomTheme = CustomThemeType;
}
