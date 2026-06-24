export const colors = {
  // Existing keys preserved exactly for backward compatibility
  ink: '#111111',       // Primary Deep Text / Dark Elements
  muted: '#6B7280',     // Accessible neutral gray for secondary text/icons
  line: '#E5E7EB',      // Clean, visible border line 
  paper: '#F9FAFB',     // Main background canvas
  surface: '#FFFFFF',   // Card / Elevated surface background
  accent: '#E84A27',    // Brand Action Color
  accentDark: '#BA3318',// Pressed/Active state accent
  green: '#10B981',     // Enhanced accessible success green
  danger: '#EF4444',    // Enhanced accessible danger red

  // Semantic mappings (Safeguards for UI/UX visibility)
  background: '#F9FAFB',
  text: '#111111',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32
};

export const shadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3
};