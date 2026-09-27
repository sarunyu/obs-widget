code = File.read("src/widgets/PrachinAlertWidget.tsx")

code.sub!(/const staticAlert = \{.*?\};\n\nsetAnnouncements\(\[staticAlert, \.\.\.recentItems\]\);/m, "if (recentItems.length > 0) {\n          setAnnouncements(recentItems);\n        } else {\n          // Hide completely if there are no recent announcements\n          setAnnouncements([]);\n          setIsVisible(false);\n        }")

code.sub!("30000);", "10000);")
code.sub!("35000);", "15000);")

File.write("src/widgets/PrachinAlertWidget.tsx", code)
