// config/design-tokens.js
// shadcn/ui 设计系统 Token 配置
// 参考: https://ui.shadcn.com/themes

module.exports = {
  // 颜色系统 - Zinc 调色板
  colors: {
    // Zinc 灰度色阶 (主要中性色)
    zinc: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b'
    },

    // 语义化颜色
    background: '#ffffff',      // 页面背景
    foreground: '#09090b',      // 主要文字

    card: '#ffffff',            // 卡片背景
    cardForeground: '#09090b',  // 卡片文字

    popover: '#ffffff',         // 弹出层背景
    popoverForeground: '#09090b', // 弹出层文字

    primary: '#18181b',         // 主要按钮
    primaryForeground: '#fafafa', // 主要按钮文字

    secondary: '#f4f4f5',       // 次要按钮
    secondaryForeground: '#18181b', // 次要按钮文字

    muted: '#f4f4f5',           // 弱化背景
    mutedForeground: '#71717a', // 弱化文字

    accent: '#f4f4f5',          // 强调背景
    accentForeground: '#18181b', // 强调文字

    destructive: '#ef4444',     // 危险/删除
    destructiveForeground: '#fafafa', // 危险按钮文字

    border: '#e4e4e7',          // 边框
    input: '#e4e4e7',           // 输入框边框
    ring: '#18181b',            // 聚焦环

    // 状态颜色
    success: '#16a34a',         // 成功/通过
    warning: '#f97316',         // 警告/待处理
    error: '#ef4444',           // 错误/拒绝
    info: '#3b82f6'             // 信息
  },

  // 间距系统 (8px 基准)
  spacing: {
    0: '0rpx',
    1: '8rpx',      // 4px
    2: '16rpx',     // 8px
    3: '24rpx',     // 12px
    4: '32rpx',     // 16px
    5: '40rpx',     // 20px
    6: '48rpx',     // 24px
    7: '56rpx',     // 28px
    8: '64rpx',     // 32px
    9: '72rpx',     // 36px
    10: '80rpx',    // 40px
    12: '96rpx',    // 48px
    16: '128rpx',   // 64px
    20: '160rpx',   // 80px
    24: '192rpx',   // 96px
    32: '256rpx',   // 128px
    40: '320rpx',   // 160px
    48: '384rpx',   // 192px
    56: '448rpx',   // 224px
    64: '512rpx'    // 256px
  },

  // 圆角系统
  radius: {
    none: '0rpx',
    sm: '6rpx',     // 3px - 小圆角
    md: '12rpx',    // 6px - 中等圆角
    lg: '16rpx',    // 8px - 大圆角
    xl: '24rpx',    // 12px - 超大圆角
    '2xl': '32rpx', // 16px
    '3xl': '48rpx', // 24px
    full: '9999rpx' // 完全圆形
  },

  // 字体大小
  fontSize: {
    xs: '24rpx',    // 12px
    sm: '28rpx',    // 14px
    base: '32rpx',  // 16px
    lg: '36rpx',    // 18px
    xl: '40rpx',    // 20px
    '2xl': '48rpx', // 24px
    '3xl': '60rpx', // 30px
    '4xl': '72rpx', // 36px
    '5xl': '96rpx'  // 48px
  },

  // 字重
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },

  // 行高
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  },

  // 阴影系统 (极简化)
  shadow: {
    none: 'none',
    sm: '0 2rpx 8rpx rgba(0, 0, 0, 0.05)',    // 微弱阴影
    md: '0 4rpx 12rpx rgba(0, 0, 0, 0.08)',   // 中等阴影
    lg: '0 8rpx 16rpx rgba(0, 0, 0, 0.1)',    // 较强阴影
    xl: '0 12rpx 24rpx rgba(0, 0, 0, 0.12)'   // 最强阴影
  },

  // 边框宽度
  borderWidth: {
    0: '0rpx',
    1: '1rpx',      // 默认细边框 (0.5px)
    2: '2rpx',      // 1px
    4: '4rpx',      // 2px
    8: '8rpx'       // 4px
  },

  // 过渡动画
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)'
  },

  // Z-index 层级
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  }
}
