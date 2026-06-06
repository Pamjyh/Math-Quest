/**
 * cutscene_story.js — Math Quest: คณิตวีรบุรุษ
 * Story by Claude × Pam | Universe: อาณาจักรคณิตา
 *
 * โครงสร้าง scene:
 *   speaker  : ชื่อที่แสดงใน dialog box ('NARRATOR' = ไม่มีชื่อ)
 *   portrait : key ของ sprite ('hero_warrior' | 'angel' | ... | null)
 *   side     : 'left' | 'right' | 'center'
 *   text     : บทพูด
 *   effect   : 'shake' | 'flash' | 'dark' | 'none'  (optional)
 */

const STORY = {

  /* ─────────────────────────────────────────
     UNIVERSE INTRO (แสดงครั้งแรกที่เปิดเกม)
  ───────────────────────────────────────── */
  universe_intro: [
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ในโลกที่ตัวเลขคือแหล่งพลังงานของทุกสิ่ง...',
      effect: 'dark'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ปราสาท สะพาน แม้แต่ดวงดาว ล้วนขับเคลื่อนด้วยสมการที่ถูกต้อง'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'จนกระทั่งวันที่... ท้าวอลวนตัดสินใจทำให้ทุกคนลืมคณิตศาสตร์',
      effect: 'flash'
    },
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: 'ถ้าข้าแก้โจทย์ไม่ได้... ก็ไม่ให้ใครแก้ได้!',
      effect: 'shake'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'วีรบุรุษแห่งอาณาจักรคณิตา... ถึงเวลาลุกขึ้นสู้แล้ว'
    }
  ],

  /* ─────────────────────────────────────────
     MODE 1 — ป.1 | ท้องฟ้ายามค่ำ | บวก/ลบ 1–20
     ตัวร้าย: มิสเตอร์โกลาหล
  ───────────────────────────────────────── */
  intro_p1: [
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'คืนหนึ่งที่โรงเรียน นักรบไทยกำลังฝึกดาบอยู่ใต้แสงดาว...'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ทันใดนั้น... เสียงหนังสือตกดังสนั่น!',
      effect: 'shake'
    },
    {
      speaker: 'นักเรียน',
      portrait: null,
      side: 'left',
      text: 'ช่วยด้วย! มีอะไรบางอย่างกินโจทย์บวกลบหมดเลย!'
    },
    {
      speaker: 'นักรบไทย',
      portrait: 'hero_warrior',
      side: 'left',
      text: 'ใครกล้าบุกโรงเรียนในคืนนี้...',
      effect: 'none'
    },
    {
      speaker: 'มิสเตอร์โกลาหล',
      portrait: 'boss_m1',
      side: 'right',
      text: 'ฮ่าฮ่าฮ่า! ข้าคือมิสเตอร์โกลาหล! กองหน้าของท้าวอลวน!',
      effect: 'flash'
    },
    {
      speaker: 'มิสเตอร์โกลาหล',
      portrait: 'boss_m1',
      side: 'right',
      text: '1+1=3! 2+2=5! จงจำไว้! ตัวเลขของข้าคือความจริง!'
    },
    {
      speaker: 'นักรบไทย',
      portrait: 'hero_warrior',
      side: 'left',
      text: '...ผิดทั้งนั้น ถ้าตอบโจทย์ถูกได้ แกก็แพ้!'
    }
  ],

  mid_p1: [
    {
      speaker: 'นักรบไทย',
      portrait: 'hero_warrior',
      side: 'left',
      text: 'เอ๊ะ... ทุกครั้งที่ตอบถูก มันสะดุ้งนะ?'
    },
    {
      speaker: 'นักรบไทย',
      portrait: 'hero_warrior',
      side: 'left',
      text: 'ตัวเลขที่ถูกต้องคือจุดอ่อนของมัน... ตอบให้มากที่สุดเลย!'
    }
  ],

  boss_p1: [
    {
      speaker: 'มิสเตอร์โกลาหล',
      portrait: 'boss_m1',
      side: 'right',
      text: 'หยุด! ข้าไม่ยอมแพ้! 10-3=8! 5+5=11!',
      effect: 'shake'
    },
    {
      speaker: 'นักรบไทย',
      portrait: 'hero_warrior',
      side: 'left',
      text: '10-3 เท่ากับ 7 ครับ... และ 5+5 เท่ากับ 10'
    },
    {
      speaker: 'มิสเตอร์โกลาหล',
      portrait: 'boss_m1',
      side: 'right',
      text: 'เท็จ! เท็จทั้งนั้น! ท้าวอลวนบอกว่า—',
      effect: 'shake'
    },
    {
      speaker: 'นักรบไทย',
      portrait: 'hero_warrior',
      side: 'left',
      text: 'ลองนับนิ้วดูสิครับ... ช้าๆ ก็ได้'
    },
    {
      speaker: 'มิสเตอร์โกลาหล',
      portrait: 'boss_m1',
      side: 'right',
      text: '...(นับ 1, 2, 3...) ...7? จริงๆ ด้วย?!'
    }
  ],

  victory_p1: [
    {
      speaker: 'มิสเตอร์โกลาหล',
      portrait: 'boss_m1',
      side: 'right',
      text: 'ไม่เป็นไปได้... ข้าคิดผิดมาตลอดเลย?'
    },
    {
      speaker: 'นักรบไทย',
      portrait: 'hero_warrior',
      side: 'left',
      text: 'ยังไม่สาย ถ้าอยากเรียนจริงๆ ประตูโรงเรียนเปิดอยู่เสมอ'
    },
    {
      speaker: 'มิสเตอร์โกลาหล',
      portrait: 'boss_m1',
      side: 'right',
      text: '...ข้าจะ... คิดดูนะ (หนีไปอย่างสับสน)'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ท้องฟ้ายามค่ำกลับคืนสู่ความสงบ ดาวเริ่มเรืองแสงอีกครั้ง',
      effect: 'flash'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'แต่ที่ไหนสักแห่ง... ท้าวอลวนยังคงรอ'
    }
  ],

  /* ─────────────────────────────────────────
     MODE 2 — ป.4 | ดินแดนภูเขาไฟ | สูตรคูณ 1–12
     ตัวร้าย: นายพลคูณบิด
  ───────────────────────────────────────── */
  intro_p4: [
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ภูเขาไฟที่เคยปะทุเป็นระเบียบตามตาราง เริ่มระเบิดแบบสุ่มจนชาวเมืองหวาดกลัว'
    },
    {
      speaker: 'นักรบมังกร',
      portrait: 'hero_dragon',
      side: 'left',
      text: '3×4=11? 7×8=50? ใครแก้ป้ายสูตรคูณบนภูเขาพวกนี้?!'
    },
    {
      speaker: 'นายพลคูณบิด',
      portrait: 'boss_m4',
      side: 'right',
      text: 'ข้านายพลคูณบิด! ผู้บัญชาการแห่งท้าวอลวน!',
      effect: 'flash'
    },
    {
      speaker: 'นายพลคูณบิด',
      portrait: 'boss_m4',
      side: 'right',
      text: '6×7=40! 9×8=65! ตามสูตรอันศักดิ์สิทธิ์ของท้าวอลวน!'
    },
    {
      speaker: 'นักรบมังกร',
      portrait: 'hero_dragon',
      side: 'left',
      text: '6×7 เท่ากับ 42 นายพล... ดูภูเขาไฟสิ มันกำลังบอกว่าแกผิด'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ภูเขาไฟเรืองแสงทองเมื่อสูตรคูณถูกต้อง... การต่อสู้เริ่มขึ้น!',
      effect: 'flash'
    }
  ],

  mid_p4: [
    {
      speaker: 'นักรบมังกร',
      portrait: 'hero_dragon',
      side: 'left',
      text: 'ยิ่งตอบถูก ภูเขาไฟยิ่งเสถียร ยิ่งผิดยิ่งสั่น'
    },
    {
      speaker: 'นักรบมังกร',
      portrait: 'hero_dragon',
      side: 'left',
      text: 'สูตรคูณที่ถูกต้องคือกุญแจควบคุมภูเขาไฟ... ตอบให้แม่น!'
    }
  ],

  boss_p4: [
    {
      speaker: 'นายพลคูณบิด',
      portrait: 'boss_m4',
      side: 'right',
      text: 'หยุดได้แล้ว! ข้าจะพิสูจน์ว่า 8×9=65!',
      effect: 'shake'
    },
    {
      speaker: 'นักรบมังกร',
      portrait: 'hero_dragon',
      side: 'left',
      text: '8×9 เท่ากับ 72 ครับนายพล'
    },
    {
      speaker: 'นายพลคูณบิด',
      portrait: 'boss_m4',
      side: 'right',
      text: 'เท็จ! ท้าวอลวนบอกว่า—!'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ภูเขาไฟปะทุพุ่งลาวาเป็นรูป "72" ขนาดยักษ์',
      effect: 'flash'
    },
    {
      speaker: 'นายพลคูณบิด',
      portrait: 'boss_m4',
      side: 'right',
      text: '...ภูเขาไฟ... มันไม่โกหกข้า...'
    }
  ],

  victory_p4: [
    {
      speaker: 'นายพลคูณบิด',
      portrait: 'boss_m4',
      side: 'right',
      text: 'ข้า... ข้าเคยรู้เรื่องพวกนี้ ก่อนที่ท้าวอลวนจะ...'
    },
    {
      speaker: 'นักรบมังกร',
      portrait: 'hero_dragon',
      side: 'left',
      text: 'ลองนึกดูสิครับ 9×9 เท่ากับเท่าไร?'
    },
    {
      speaker: 'นายพลคูณบิด',
      portrait: 'boss_m4',
      side: 'right',
      text: '...(หลับตานึก)... ...81... ใช่ไหม?'
    },
    {
      speaker: 'นักรบมังกร',
      portrait: 'hero_dragon',
      side: 'left',
      text: 'ถูกต้องครับ นายพลยังจำได้'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ภูเขาไฟปะทุครั้งสุดท้าย เป็นพลุสวยงามทั่วท้องฟ้า',
      effect: 'flash'
    }
  ],

  /* ─────────────────────────────────────────
     MODE 3 — ป.5 | ยอดเขาหิมะ | คูณ 2หลัก + หาร
     ตัวร้าย: ปู่เวทย์ลืมเลข
  ───────────────────────────────────────── */
  intro_p5: [
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'เส้นทางบนยอดเขาแบ่งแยกเป็นพันทิศ ป้ายทุกอันมีโจทย์... แต่คำตอบผิดทั้งหมด'
    },
    {
      speaker: 'นางฟ้า',
      portrait: 'hero_fairy',
      side: 'left',
      text: 'นักเดินทางหลงป่าในหิมะเต็มไปหมด... ต้องหาคนที่แก้ป้ายพวกนี้ให้เจอ'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ในหิมะลึก นางฟ้าพบชายเฒ่าในเสื้อคลุมขาดวิ่น กำลังเขียนสมการบนก้อนหิมะแล้วลบทิ้ง'
    },
    {
      speaker: 'ปู่เวทย์',
      portrait: 'boss_m5',
      side: 'right',
      text: '48÷6... 48÷6... ข้าจำได้ว่าเคยรู้... แต่ตอนนี้... ลืมหมดแล้ว'
    },
    {
      speaker: 'นางฟ้า',
      portrait: 'hero_fairy',
      side: 'left',
      text: 'ปู่ครับ... ปู่ไม่ได้เป็นคนร้ายใช่ไหม?'
    },
    {
      speaker: 'ปู่เวทย์',
      portrait: 'boss_m5',
      side: 'right',
      text: 'ห้ามผ่าน! ปู่ไม่รู้ว่าทำไม แต่... ห้ามผ่าน!',
      effect: 'shake'
    }
  ],

  mid_p5: [
    {
      speaker: 'นางฟ้า',
      portrait: 'hero_fairy',
      side: 'left',
      text: 'สังเกตไหม... ทุกครั้งที่ตอบถูก ดวงตาของปู่จะวาวขึ้นชั่วครู่'
    },
    {
      speaker: 'นางฟ้า',
      portrait: 'hero_fairy',
      side: 'left',
      text: 'เขาไม่ได้อยากทำลายอะไร... เขาแค่ลืมไปแล้ว ช่วยให้เขาจำได้ดีกว่า!'
    }
  ],

  boss_p5: [
    {
      speaker: 'ปู่เวทย์',
      portrait: 'boss_m5',
      side: 'right',
      text: 'ห้ามผ่าน! ปู่จะ... ปู่จะ...',
      effect: 'shake'
    },
    {
      speaker: 'นางฟ้า',
      portrait: 'hero_fairy',
      side: 'left',
      text: 'ปู่ครับ ตอบกับหนูได้ไหม... 56÷8 เท่ากับเท่าไร?'
    },
    {
      speaker: 'ปู่เวทย์',
      portrait: 'boss_m5',
      side: 'right',
      text: '...(หยุดนิ่ง) ...56÷8...'
    },
    {
      speaker: 'นางฟ้า',
      portrait: 'hero_fairy',
      side: 'left',
      text: 'ค่อยๆ คิดครับ ไม่ต้องรีบ'
    },
    {
      speaker: 'ปู่เวทย์',
      portrait: 'boss_m5',
      side: 'right',
      text: '...7... เท่ากับ 7 ใช่ไหม?'
    },
    {
      speaker: 'นางฟ้า',
      portrait: 'hero_fairy',
      side: 'left',
      text: 'ถูกต้องครับ ปู่ยังจำได้!'
    }
  ],

  victory_p5: [
    {
      speaker: 'ปู่เวทย์',
      portrait: 'boss_m5',
      side: 'right',
      text: 'ข้าจำได้แล้ว... ข้าจำได้แล้ว!',
      effect: 'flash'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'หิมะทั้งยอดเขาละลายกลายเป็นดอกไม้สีขาวนับพันดอก'
    },
    {
      speaker: 'ปู่เวทย์',
      portrait: 'boss_m5',
      side: 'right',
      text: 'เด็กน้อย... ปู่มีเรื่องจะเล่าให้ฟัง เรื่องของท้าวอลวน...'
    },
    {
      speaker: 'ปู่เวทย์',
      portrait: 'boss_m5',
      side: 'right',
      text: 'เขาไม่ได้เป็นคนเลวตั้งแต่ต้น ปู่เป็นคนสอนเขา... และปู่เป็นคนทำให้เขาเจ็บปวด'
    },
    {
      speaker: 'นางฟ้า',
      portrait: 'hero_fairy',
      side: 'left',
      text: 'เล่าให้ฟังได้เลยครับ ปู่...'
    }
  ],

  /* ─────────────────────────────────────────
     MODE 4 — ป.6 | ปราสาทสีทอง | โจทย์ผสม 2 ขั้น
     ตัวร้าย: ท้าวอลวน (ราชา)
  ───────────────────────────────────────── */
  intro_p6: [
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ปราสาทสีทองตั้งตระหง่าน ทุกประตูล็อคด้วยโจทย์คณิตศาสตร์ 2 ขั้นตอน'
    },
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: 'มาถึงแล้วก็ดี! ข้ารอมานานแล้ว!',
      effect: 'flash'
    },
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: 'คณิตศาสตร์ไม่จำเป็นสำหรับใคร! ข้าจะทำให้ทุกคนลืมมันไปตลอดกาล!'
    },
    {
      speaker: 'วีรบุรุษ',
      portrait: 'hero_ultimate',
      side: 'left',
      text: 'ทำไมถึงเกลียดคณิตศาสตร์มากขนาดนี้?'
    },
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: 'เงียบ! ไม่ต้องรู้! เพียงแค่... ยอมแพ้!',
      effect: 'shake'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'แต่ที่มุมห้อง มีหนังสือเก่าๆ สักเล่ม ปกเขียนว่า "สมบัติของเจ้าชายน้อย"'
    }
  ],

  mid_p6: [
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ยิ่งแก้โจทย์ถูก กำแพงปราสาทยิ่งสว่าง เผยให้เห็นภาพวาดเก่าๆ บนผนัง'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'เด็กชายตัวเล็กพยายามเขียนเลขอย่างตั้งใจ... แล้วภาพถัดไปคือเด็กชายคนเดิมร้องไห้คนเดียวกลางห้องเรียน'
    },
    {
      speaker: 'วีรบุรุษ',
      portrait: 'hero_ultimate',
      side: 'left',
      text: 'นี่คือ... ท้าวอลวน ตอนยังเด็ก?'
    },
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: 'อย่ามองภาพพวกนั้น! สู้เลย!',
      effect: 'shake'
    }
  ],

  boss_p6: [
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: 'ข้าเกลียดตัวเลข! ตัวเลขทำให้ข้าอับอาย!',
      effect: 'shake'
    },
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: 'ถ้าไม่มีตัวเลข ก็ไม่มีใครต้องอับอาย! ไม่มีใครต้องร้องไห้!'
    },
    {
      speaker: 'วีรบุรุษ',
      portrait: 'hero_ultimate',
      side: 'left',
      text: 'ท้าวอลวน... ข้าเข้าใจ'
    },
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: 'อย่ามาแกล้งทำเป็นเข้าใจ! ไม่มีใครเข้าใจ!'
    },
    {
      speaker: 'วีรบุรุษ',
      portrait: 'hero_ultimate',
      side: 'left',
      text: 'ข้าก็เคยตอบผิดต่อหน้าทุกคน แต่ข้าลองอีกครั้ง... และอีกครั้ง'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ทุกโจทย์ที่ตอบถูก ท้าวอลวนเจ็บ... แต่ในดวงตาเขามีบางอย่างที่ไม่ใช่ความเกลียด',
      effect: 'none'
    }
  ],

  victory_p6: [
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ท้าวอลวนล้มลง มงกุฎกระเด็นออก เขาดูเหมือนเด็กที่เหนื่อยมากเป็นปีๆ',
      effect: 'dark'
    },
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: '...ทำไม... ทำไมแกถึงไม่หัวเราะ?'
    },
    {
      speaker: 'วีรบุรุษ',
      portrait: 'hero_ultimate',
      side: 'left',
      text: 'เพราะตอบผิดไม่ใช่เรื่องน่าอาย ทุกคนตอบผิดได้ สำคัญคือลองอีกครั้ง'
    },
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: 'แต่ตอนนั้น... ทุกคนหัวเราะ แม้แต่ครู...'
    },
    {
      speaker: 'วีรบุรุษ',
      portrait: 'hero_ultimate',
      side: 'left',
      text: 'แล้วครั้งนี้... มีข้าอยู่ด้วย จะลองด้วยกันไหม?'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ท้าวอลวนหยิบดินสอขึ้นมา... เป็นครั้งแรกในรอบหลายปี',
      effect: 'flash'
    },
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: 'ข้า... ข้าจะลอง'
    }
  ],

  /* ─────────────────────────────────────────
     TRUE ENDING — หลังผ่านทุก Mode
  ───────────────────────────────────────── */
  true_ending: [
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ท้าวอลวนยกเลิกคำสั่งทั้งหมด ลูกน้องทุกคนกลับมาเรียนคณิตศาสตร์',
      effect: 'flash'
    },
    {
      speaker: 'มิสเตอร์โกลาหล',
      portrait: 'boss_m1',
      side: 'left',
      text: '1+1=2! ข้าจำได้แล้ว!'
    },
    {
      speaker: 'นายพลคูณบิด',
      portrait: 'boss_m4',
      side: 'right',
      text: '9×9=81! ข้ากลับมาแล้ว!'
    },
    {
      speaker: 'ปู่เวทย์',
      portrait: 'boss_m5',
      side: 'left',
      text: 'ข้าจะสอนใหม่ทุกอย่าง ขอโทษที่ทำให้เธอเจ็บปวด...'
    },
    {
      speaker: 'ท้าวอลวน',
      portrait: 'villain_chaoz',
      side: 'right',
      text: 'ข้าเคยกลัวตัวเลข... ตอนนี้ข้าเป็นเพื่อนกับมันแล้ว'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'และวีรบุรุษคนที่ 8 แห่งอาณาจักรคณิตา คือเด็กชายที่ครั้งหนึ่งเคยสอบตก',
      effect: 'flash'
    },
    {
      speaker: 'NARRATOR',
      portrait: null,
      side: 'center',
      text: 'ขอบคุณที่ช่วยพิทักษ์อาณาจักรคณิตา วีรบุรุษ!'
    }
  ],

  /* ─────────────────────────────────────────
     HERO UNLOCK SCENES (เมื่อปลดล็อคตัวละคร)
  ───────────────────────────────────────── */
  unlock_angel: [
    {
      speaker: 'เทวดา',
      portrait: 'hero_angel',
      side: 'right',
      text: 'อุ๊ย! จะต้องมาเร็วขนาดนี้เลยเหรอ... ก็ดี ข้ามาแล้ว!'
    }
  ],
  unlock_giant: [
    {
      speaker: 'ยักษ์วีรบุรุษ',
      portrait: 'hero_giant',
      side: 'right',
      text: 'ยักษ์ก็เรียนได้นะ! ข้าพิสูจน์ให้ดู!'
    }
  ],
  unlock_dragon: [
    {
      speaker: 'นักรบมังกร',
      portrait: 'hero_dragon',
      side: 'right',
      text: 'ไฟของข้าจะลุกโชนเมื่อตัวเลขถูกต้อง!'
    }
  ],
  unlock_fairy: [
    {
      speaker: 'นางฟ้า',
      portrait: 'hero_fairy',
      side: 'right',
      text: 'ตัวเลขสวยงามเหมือนดอกไม้ค่ะ มาสู้ด้วยกันนะ!'
    }
  ],
  unlock_indra: [
    {
      speaker: 'พระอินทร์',
      portrait: 'hero_indra',
      side: 'right',
      text: 'สายฟ้าของข้าต้องแม่นยำอย่างคณิตศาสตร์!',
      effect: 'flash'
    }
  ],
  unlock_vaisravana: [
    {
      speaker: 'ท้าวเวสสุวรรณ',
      portrait: 'hero_vaisravana',
      side: 'right',
      text: 'กองทัพที่ดีต้องนับให้ถูกก่อน! ตามข้ามา!'
    }
  ],
  unlock_ultimate: [
    {
      speaker: 'สุดยอดวีรบุรุษ',
      portrait: 'hero_ultimate',
      side: 'right',
      text: 'ข้าเคยกลัวตัวเลข... ตอนนี้เป็นเพื่อนกันแล้ว',
      effect: 'flash'
    },
    {
      speaker: 'สุดยอดวีรบุรุษ',
      portrait: 'hero_ultimate',
      side: 'right',
      text: 'ถ้าข้าทำได้ เธอก็ทำได้เช่นกัน!'
    }
  ]
};

// Export สำหรับ cutscene.js
if (typeof module !== 'undefined') module.exports = STORY;
