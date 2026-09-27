code = File.read("src/widgets/PrachinAlertWidget.tsx")

static_alert = <<~CODE
        const staticAlert = {
          title: "ปภ.เตือนน้ำท่วม",
          message: "เกิดน้ำท่วมในพื้นที่ จ.ปราจีนบุรี มีบ้านเรือนได้รับผลกระทบ 4,100 หลัง และระดับน้ำในแม่น้ำปราจีนบุรี ยังคงเพิ่มสูงขึ้นต่อเนื่อง คาดว่าจะสูงขึ้นอีกประมาณ 1 เมตร โดยเฉพาะ ในเขตเทศบาลเมืองปราจีนบุรี อ.ศรีมหาโพธิ อ.นาดี อ.กบินทร์บุรี และพื้นที่ใกล้เคียง ขอให้ผู้ที่อาศัยริมแม่น้ำ/ที่ลุ่มต่ำ/พื้นที่เสี่ยง ยกของขึ้นที่สูงทันที เคลื่อนย้ายรถทันที เก็บทรัพย์สินมีค่าและเอกสารสำคัญ ระวังไฟฟ้าดูด เคลื่อนย้ายกลุ่มเปราะบาง อพยพไปยังศูนย์พักพิงทันที หากต้องการความช่วยเหลือให้แจ้งกำนัน ผู้ใหญ่บ้าน หรือผู้นำชุมชน DDPM",
          created_at: "2026-09-27T16:53:18"
        };
        
        setAnnouncements([staticAlert, ...recentItems]);
CODE

code.sub!(/if \(recentItems\.length > 0\) \{.*?setIsVisible\(false\);\n\s+\}/m, static_alert.strip)

# Modify the loop so it stays longer, say 30 seconds instead of 10 seconds, so people can read it.
code.sub!("10000);", "30000);")
code.sub!("15000);", "35000);")

File.write("src/widgets/PrachinAlertWidget.tsx", code)
