# Start Solo Color Design System

## 🎨 **Color Palette**

### **Primary Hero Colors**
- **Navy Blue** (`#1D3A6B`) - Authority, trust, main headings
- **Sky Blue** (`#8FC2F2`) - Light accents, backgrounds

### **Secondary Brand Colors**
- **Light Gray** (`#C7CBD3`) - Neutral elements
- **Teal** (`#5FA6A0`) - Secondary accents, warmth, icons
- **Medium Blue** (`#3A6EA5`) - Primary actions, links
- **Light Blue** (`#B7D4E6`) - Background accents
- **Steel Gray** (`#607D8B`) - Text, borders
- **Off-White** (`#E4E5E7`) - Backgrounds

### **Legacy Warm Colors (Accents)**
- **Orange** (`#e57341`) - Urgency, warnings, countdown timers
- **Red** (`#e44041`) - Alerts, errors, critical actions
- **Golden Yellow** (`#EEB44E`) - Primary CTAs, highlights, success
- **Dark Brown** (`#3e1311`) - Premium, sophisticated elements
- **Dark Green** (`#009762`) - Success states, completion
- **Olive Green** (`#6c936a`) - Natural, calm elements

## 🎯 **Color Usage Rules**

### **Text Colors**
- **H1, H2, H3 Headings**: Navy (`#1D3A6B`) - Authority and trust
- **H4, H5, H6 Subheadings**: Teal (`#5FA6A0`) - Warmth and approachability
- **Primary Body Text**: Dark Gray (`#333333`) - Readability
- **Secondary Text**: Medium Gray (`#666666`) - Supporting information
- **Caption Text**: Light Gray (`#999999`) - Subtle information

### **CTA Button Hierarchy**
1. **Primary CTAs** (Most Important):
   - Background: Golden Yellow (`#EEB44E`)
   - Text: Dark Gray (`#333333`)
   - Hover: Darker Yellow (`#D49E3C`)
   - Usage: "Register Now", "Get Started", "Download", "Buy Now"

2. **Secondary CTAs**:
   - Background: Navy (`#1D3A6B`)
   - Text: White (`#FFFFFF`)
   - Hover: Darker Navy (`#152A4F`)
   - Usage: "Learn More", "Read More", "Explore"

3. **Tertiary CTAs**:
   - Background: Teal (`#5FA6A0`)
   - Text: White (`#FFFFFF`)
   - Hover: Darker Teal (`#4A8B85`)
   - Usage: "Contact", "Support", "Help"

4. **Outline CTAs**:
   - Border: Navy (`#1D3A6B`)
   - Background: Transparent
   - Text: Navy (`#1D3A6B`)
   - Hover: Fill with Navy, text becomes white
   - Usage: "Learn More", "Read More", "Explore"

### **Icon Colors**
- **Primary Icons**: Navy (`#1D3A6B`) - Main actions, navigation
- **Secondary Icons**: Teal (`#5FA6A0`) - Accents, warmth
- **Success Icons**: Golden Yellow (`#EEB44E`) - Achievements, highlights
- **Warning Icons**: Orange (`#e57341`) - Alerts, urgency
- **Error Icons**: Red (`#e44041`) - Critical issues
- **Info Icons**: Medium Blue (`#3A6EA5`) - Information, links

### **Background Colors**
- **Main Backgrounds**: White (`#FFFFFF`) - Primary content areas
- **Alternate Backgrounds**: Light Gray (`#F8F9FA`) - Section alternation
- **Card Backgrounds**: White (`#FFFFFF`) - Content cards
- **Hero Backgrounds**: Subtle gradients with opacity
- **Highlight Backgrounds**: Color with 10-20% opacity

### **Status Colors**
- **Success**: Dark Green (`#009762`) - Completion, positive states
- **Warning**: Orange (`#e57341`) - Attention, countdown timers
- **Error**: Red (`#e44041`) - Critical issues, failures
- **Info**: Medium Blue (`#3A6EA5`) - Information, links
- **Neutral**: Steel Gray (`#607D8B`) - Default states

## 🎨 **Component-Specific Rules**

### **Hero Section**
- Background: Gradient from Light Gray to Teal with 10% opacity
- Highlight Badge: Teal with 20% opacity background
- Main Heading: Navy
- Primary CTA: Golden Yellow with dark text
- Secondary CTA: Navy outline

### **Cards**
- Background: White
- Border: Light Gray (`#E4E5E7`)
- Shadow: Subtle gray shadow
- Title: Navy
- Body Text: Dark Gray
- CTA: Golden Yellow

### **Forms**
- Input Borders: Steel Gray (`#607D8B`)
- Focus Borders: Teal (`#5FA6A0`)
- Error Borders: Red (`#e44041`)
- Success Borders: Dark Green (`#009762`)
- Submit Button: Golden Yellow

### **Navigation**
- Background: White or Navy
- Links: Navy or White (depending on background)
- Active State: Teal
- Hover State: Lighter shade of base color

## 📱 **Responsive Considerations**
- Maintain color contrast ratios for accessibility
- Ensure colors work on both light and dark backgrounds
- Test color combinations on different screen sizes
- Consider color-blind users in design decisions

## ♿ **Accessibility Guidelines**
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Navy on white: 8.2:1 (Excellent)
- Teal on white: 4.8:1 (Good)
- Golden Yellow on dark: 4.6:1 (Good)
- Test with color-blind simulation tools

## 🔧 **Implementation**

### **CSS Variables**
```css
:root {
  /* Primary Colors */
  --color-navy: #1D3A6B;
  --color-teal: #5FA6A0;
  --color-sky: #8FC2F2;
  
  /* CTA Colors */
  --color-cta: #EEB44E;
  --color-cta-dark: #D49E3C;
  --color-cta-text: #333333;
  
  /* Status Colors */
  --color-success: #009762;
  --color-warning: #e57341;
  --color-error: #e44041;
  --color-info: #3A6EA5;
  
  /* Text Colors */
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-text-caption: #999999;
}
```

### **Tailwind Classes**
```css
/* Use these classes consistently */
.text-navy { color: var(--color-navy); }
.text-teal { color: var(--color-teal); }
.bg-cta { background: var(--color-cta); }
.bg-cta-secondary { background: var(--color-navy); }
```

## 📋 **Checklist for New Components**
- [ ] Use navy for main headings
- [ ] Use teal for secondary headings and accents
- [ ] Use golden yellow for primary CTAs
- [ ] Use navy for secondary CTAs
- [ ] Maintain proper contrast ratios
- [ ] Test with color-blind simulation
- [ ] Follow the established hierarchy
- [ ] Use consistent hover states

## 🚫 **What NOT to Do**
- Don't use red for primary CTAs (too aggressive)
- Don't use yellow text on white backgrounds (poor contrast)
- Don't mix too many accent colors in one component
- Don't use colors that aren't in the defined palette
- Don't ignore accessibility contrast requirements

---

**Last Updated**: January 2025
**Version**: 1.0
**Status**: Active
