# WooCommerce PDF Voucher Manager - Text Stamping Edition

## Version 10.0 - Complete Refactor

This is a **completely refactored version** of your WordPress/WooCommerce PDF voucher plugin. The major change is that it now uses **static text stamping** to overlay voucher information directly onto PDFs, instead of filling form fields.

---

## 🎯 What Changed?

### Old Method (v9.0)
- Required PDF templates with **fillable form fields**
- Used FPDM library to fill fields by name
- Limited to PDF version 1.4
- Field names had to match exactly

### New Method (v10.0)
- Works with **any PDF template** (no form fields needed!)
- Uses Python with `pypdf` and `reportlab` to stamp text
- Works with any PDF version
- Flexible positioning with presets or custom coordinates

---

## 🔧 Server Requirements

### Required
1. **Python 3** installed on server
2. **Python packages:**
   ```bash
   pip3 install pypdf reportlab
   ```

### Verification
The plugin will check for Python availability in the admin area and show warnings if not found.

---

## 📦 Installation

1. **Remove old plugin files** (backup first!)
   - Remove `fpdm/` folder (no longer needed)
   - Remove old plugin file

2. **Upload new plugin:**
   - Upload `woo-pdf-voucher-stamped.php` to `/wp-content/plugins/`

3. **Activate the plugin** in WordPress admin

4. **Verify system requirements** in Settings page

---

## 🎨 Product Configuration

When editing a WooCommerce product, you'll now see these fields:

### 1. PDF Template URL
- Upload any PDF to Media Library
- Copy the file URL and paste here
- **No form fields required!** Any PDF works

### 2. Target Page Number
- Which page to stamp the text on (default: 1)
- Useful for multi-page PDFs

### 3. Position Preset
Choose from:
- **Top-Left** - Safe margin from top-left corner
- **Top-Right** - Safe margin from top-right corner
- **Bottom-Left** - Safe margin from bottom-left corner
- **Bottom-Right** - Safe margin from bottom-right corner
- **Center** - Centered on page

All presets include a 10mm safety margin from page edges.

### 4. Custom Position (Optional)
Override the preset with exact coordinates:

**Percentage format:**
```
90% 90%    (90% from left, 90% from top)
10% 10%    (10% from left, 10% from top)
```

**Millimeter format:**
```
20mm 30mm  (20mm from left, 30mm from top)
10mm 280mm (10mm from left, 280mm from top)
```

**Mixed format:**
```
50% 20mm   (50% from left, 20mm from top)
```

### 5. Font Size
- Size in points (default: 12pt)
- Range: 6-72pt

---

## 📝 How Text is Positioned

### Text Block Behavior
The plugin treats customer name and voucher code as a **single grouped text block**:

```
John Smith          ← Customer name (top)
V-123-ABCD         ← Voucher code (bottom)
```

### Key Features:
1. **Left-aligned internally** - Text lines align to the left within the block
2. **Tight spacing** - Minimal gap between lines (no extra padding)
3. **Smart anchoring** - The position you specify becomes the anchor point

### Anchor Point Logic

The position you specify (either preset or custom) determines where the text block is **anchored**:

| Preset/Anchor | Text Block Position |
|---------------|---------------------|
| Top-Left | Top-left corner of block at coordinates |
| Top-Right | Top-right corner of block at coordinates |
| Bottom-Left | Bottom-left corner of block at coordinates |
| Bottom-Right | Bottom-right corner of block at coordinates |
| Center | Center of block at coordinates |

**This ensures text never falls off the page** regardless of which corner you use!

---

## 🔍 Examples

### Example 1: Receipt-style voucher
**Template:** Blank PDF
**Settings:**
- Position: `Top-Left`
- Font Size: `14`

**Result:** Text appears in top-left with safe margin

---

### Example 2: Certificate with signature area
**Template:** Certificate PDF with signature line at bottom
**Settings:**
- Position: `Bottom-Right`
- Custom Position: `180mm 20mm`
- Font Size: `10`

**Result:** Text block's bottom-right corner aligns to 180mm from left, 20mm from top

---

### Example 3: Centered voucher code
**Template:** Gift card design
**Settings:**
- Position: `Center`
- Font Size: `16`

**Result:** Text block centered on page

---

## 🧪 Testing

### Use the Test Generator
1. Go to **Vouchers → Settings**
2. Select a product with PDF template configured
3. Click **Run Test Generation**
4. Check the debug log for detailed output
5. Download and verify the generated PDF

### Debug Log
All operations are logged to:
```
/wp-content/uploads/voucher-generated/debug_log.txt
```

View it from the Settings page or access directly.

---

## 🔐 Security Features (Preserved)

All security features from v9.0 are maintained:

### Role-Based Access
- Only **Super Administrators** can create manual vouchers
- All users can view vouchers
- Editors/Shop Managers can mark vouchers as used

### Voucher Status Tracking
- **Available** / **Used** status
- Auto-captures staff name and timestamp
- Only Super Admins can change from Used → Available

### Locked Fields
- Voucher code: Locked after generation
- Customer name: Locked after first save
- Prevents tampering and maintains audit trail

---

## 🚀 Workflow

### Automatic Generation (from orders)
1. Customer purchases product with PDF template
2. Order completes (payment confirmed)
3. Plugin generates voucher(s) automatically
4. PDF(s) attached to completion email
5. Download links appear in order details

### Manual Generation
1. **Vouchers → Add New** (Super Admin only)
2. Select product template
3. Enter customer name
4. Click **Publish**
5. PDF generates automatically

---

## 🐛 Troubleshooting

### "Python 3 not available"
**Solution:** Install Python 3 on server
```bash
# Check version
python3 --version

# Install if missing (Ubuntu/Debian)
sudo apt-get install python3
```

### "Module 'pypdf' not found"
**Solution:** Install required packages
```bash
pip3 install pypdf reportlab
```

### "PDF generation failed"
1. Check debug log for Python errors
2. Verify PDF template URL is accessible
3. Confirm upload directory is writable
4. Test with a simple blank PDF first

### "Text appears cut off"
1. Reduce font size
2. Use different position preset
3. Adjust custom position coordinates
4. Check page size in debug log

### "Text in wrong position"
1. Verify coordinate system (% vs mm)
2. Check which corner/preset you're using
3. Remember: coordinates anchor the text block
4. Test with Center preset first

---

## 📊 Migration from v9.0

### What to do with existing vouchers:
- **Old vouchers remain functional** - PDFs already generated
- **No regeneration needed** for existing orders
- **New orders use new system** automatically

### Template migration:
1. Your old PDF templates still work
2. You can use the **same PDFs** without form fields
3. Or create new clean templates without fields
4. Configure positioning in product settings

### Settings migration:
- Old field mapping settings are ignored (no longer needed)
- Configure new positioning settings per product
- Test each product template individually

---

## 💡 Best Practices

### Template Design
1. Use clean, simple PDF backgrounds
2. Leave clear space for text overlay
3. Test with different customer name lengths
4. Consider multi-language names

### Position Settings
1. Start with presets before custom positions
2. Test with longest expected customer names
3. Use millimeters for precise control
4. Keep 10mm minimum margin from edges

### Font Size
1. 12pt is readable for most uses
2. Increase to 14-16pt for emphasis
3. Decrease to 10pt for tight spaces
4. Test readability after printing

---

## 🆘 Support

### Debug Information
Always include when reporting issues:
1. Debug log contents
2. Product settings (screenshot)
3. PDF template (if possible)
4. Generated PDF (if created)
5. Python version: `python3 --version`

### Common Questions

**Q: Can I use my old PDF templates?**
A: Yes! The new version works with ANY PDF.

**Q: Do I need to remove form fields from PDFs?**
A: No, form fields are simply ignored. But you can use templates without fields.

**Q: Can I position text anywhere?**
A: Yes, use custom position with exact coordinates.

**Q: Does it work with multi-page PDFs?**
A: Yes, specify target page number in product settings.

**Q: Can I customize the text content?**
A: Currently shows customer name + voucher code. Code customization needed for other content.

---

## 📜 License

Same license as original plugin.

## 👤 Credits

- Original Plugin: Adhitya
- Refactor (v10.0): Adhitya & Claude
- Libraries: pypdf, reportlab

---

## 🔄 Version History

### v10.0 (Text Stamping Edition)
- Complete refactor from form-filling to text stamping
- Works with any PDF template
- Flexible positioning system
- Python-based generation
- Preserved all security features

### v9.0 (Security Edition)
- Form field filling with FPDM
- Role-based access control
- Voucher status tracking
- Field locking

---

## 📞 Quick Start Checklist

- [ ] Python 3 installed on server
- [ ] `pypdf` and `reportlab` packages installed
- [ ] Old plugin deactivated/removed
- [ ] New plugin uploaded and activated
- [ ] System check passed (Settings page)
- [ ] Product configured with PDF template URL
- [ ] Position preset selected (start with Top-Right)
- [ ] Font size set (start with 12pt)
- [ ] Test generation successful
- [ ] Test order completed
- [ ] PDF received and verified

**You're ready to go! 🎉**
