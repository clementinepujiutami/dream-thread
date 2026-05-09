<div align="center">

```
        ✦         ·    ✧
   ·         ✦         ·
       ⋆          ·  
  ✧        ☾          ✦
              ·
       ✦      ⋆     ·
```

# 🌙 Dream Thread

***voice-first dream capture***

*The AI listens. Reflects your mood. Never tells you what it means.*

---

[![Built at](https://img.shields.io/badge/built_at-Cursor_Hackathon_2026-1A1438?style=for-the-badge&labelColor=2C2358)](https://github.com/clementinepujiutami/dream-thread)
[![Built in](https://img.shields.io/badge/built_in-2.5_hours-F2D472?style=for-the-badge&labelColor=2C2358)](https://github.com/clementinepujiutami/dream-thread)
[![Status](https://img.shields.io/badge/status-dreaming-F4B8D9?style=for-the-badge&labelColor=2C2358)](https://github.com/clementinepujiutami/dream-thread)

</div>

---

## ✦ It's 3am.

You just had the most vivid dream of your life.

You reach for your phone -

and by the time it unlocks,

***it's already gone.***

---

## ☾ What Dream Thread is

A dream journal that meets you at the moment you actually need it - **half-asleep, eyes closed, 3am**.

One tap on the lock screen. Whisper into the dark. Go back to sleep.

The AI doesn't interpret. It doesn't analyse. It doesn't tell you what your dream "means."

It just **listens, reflects your mood, and files it away** - so when you wake up properly, your dream is still there. And six months from now, the patterns surface on their own.

---

## ✧ The problem every app ignores

| | |
|:---:|:---|
| **`90s`** | Dream memory half-life. Without rehearsal, most content is inaccessible within 90 seconds of waking. *(Stickgold et al.)* |
| **`4-6`** | Taps to open any other app. Wake -> unlock -> find -> open -> navigate -> record. The dream is gone before you start. |
| **`30m`** | Blue-light sleep delay. Screen exposure at 3am suppresses melatonin and pushes sleep re-onset by up to 30 minutes. |

---

## 🌌 Every competitor has the same flaw

<table>
<tr>
<td width="50%" valign="top">

#### ✗ The market
*Elsewhere · Dreamy · Temenos · Oniri*

- Require screen unlock to capture
- Deliver deep psychoanalytic interpretation
- Generate images, meaning, reflections
- Multiple AI calls per dream
- Store or share your dream content
- TOS grants content rights *(Temenos)*

</td>
<td width="50%" valign="top">

#### ✓ Dream Thread
*voice-first · mood-aware · privacy-first*

- Tap record from the lock screen. Eyes stay closed.
- AI reflects mood - never tells you what it means
- Exactly one AI call. Mood + tags out.
- Near-black UI - zero blue light exposure
- Raw audio never leaves your device
- You own everything. No carve-outs.

</td>
</tr>
</table>

---

## 🌠 How it works

```
   ┌─────────────────┐
   │       ☾         │
   │                 │
   │   tap to record │
   │                 │
   │      ╭───╮      │
   │     │  🎙  │     │
   │      ╰───╯      │
   │                 │
   └─────────────────┘
```

**`01`** ⚡ &nbsp; **Tap record** - One tap on the lock screen. No unlock. Eyes stay closed.

**`02`** 🎙 &nbsp; **Whisper your dream** - On-device Whisper transcribes your voice. Raw audio never leaves the phone.

**`03`** 🧠 &nbsp; **Mood + tags appear** - One Claude call. Mood, symbols, setting - gentle reflections. Never deep analysis.

**`04`** ☾ &nbsp; **Screen goes dark** - No confirmation. No animations. Silent haptic. Go back to sleep.

---

## 🪶 What Dream Thread believes

> *"Put it all down as beautifully as you can - in some beautifully bound book... for you it will be your church - your cathedral - the silent place of your spirit where you will find renewal."*
>
> **- Carl Jung**

✧ &nbsp; **The AI is a librarian, not an analyst.** It files. It reflects mood. You think. Your meaning is yours to find.

✧ &nbsp; **Meaning lives in accumulation.** Not one session. The moment, six months in, when patterns surface on their own.

✧ &nbsp; **Cathedral quality over dashboard utility.** The comparison is a Moleskine, not Calm. Beautiful, quiet, irreplaceable.

---

## 🔒 Privacy by architecture

> *Not a privacy policy. An architectural guarantee.*

| Layer | Guarantee |
|:------|:----------|
| 🔐 **Raw audio** | Never leaves the device. Whisper runs on-device. |
| 🔐 **Dream transcript** | Stays local. Never synced. Never on our servers. |
| 🔐 **AI training data** | Zero tolerance. No opt-in exists. Ever. |
| 🔐 **Encryption** | AES-256 SQLCipher. Key in Secure Enclave. |
| 🔐 **Content ownership** | Users own everything. Stated plainly. No carve-outs. |
| ⚠️  **Temenos ToS** | *Grants content rights to the platform. (Not us.)* |

---

## ✦ Business model

<table>
<tr>
<th width="33%">Free</th>
<th width="33%">⭐ Premium</th>
<th width="33%">Lifetime</th>
</tr>
<tr>
<td valign="top">

**`$0`** *forever*

- Unlimited voice capture
- AI mood + tags - all dreams
- Full journal + search
- Full export - always ungated
- Pattern surface (basic)

*Genuinely useful. Not a nag screen.*

</td>
<td valign="top">

**`$6`** */ month*
**`$49`** */ year*

- Framework lenses *(Jungian, narrative, creative)*
- Dream Atlas - visual settings map
- Quarterly contemplative biography
- Advanced pattern visualizations
- Priority support

*Earns upgrade through value.*

</td>
<td valign="top">

**`$99`** *one-time*

- All premium features
- No subscription ever
- For committed practitioners
- Comparable to DreamBoard model

*Converts the most loyal users.*

</td>
</tr>
</table>

> 💸 **API cost per user:** ~$0.12/month at 30 dreams (Claude tagging + Whisper transcription).
> Free tier is sustainable. Premium is trivially profitable.

---

## 🛠 Tech stack

```
   Frontend     →  Native iOS (SwiftUI + WidgetKit)
                   Native Android (Jetpack Compose)

   Lock screen  →  Live Activities (iOS 17+ App Intents)
                   Quick Settings tile (Android)

   Voice        →  Whisper - runs entirely on-device

   Tagging      →  Claude (one API call, JSON out)

   Storage      →  SQLCipher · AES-256 · Secure Enclave
                   Zero cloud sync by default

   Built with   →  Cursor · Claude · Whisper
```

---

## 🌙 Getting started

```bash
# Clone the dream
git clone https://github.com/clementinepujiutami/dream-thread.git
cd dream-thread

# Install
npm install   # or pnpm / yarn / bun

# Run
npm run dev
```

> ⚠️ *This project was built in 2.5 hours at Cursor Hackathon 2026. Expect rough edges. Expect dreams.*

---

## ✧ Roadmap

- [x] Lock-screen one-tap capture
- [x] On-device Whisper transcription
- [x] Mood + tag reflection via Claude
- [x] Local-only encrypted storage
- [ ] Pattern surface - basic visualisations
- [ ] Dream Atlas - visual settings map *(premium)*
- [ ] Framework lenses - Jungian / narrative / creative *(premium)*
- [ ] Quarterly contemplative biography *(premium)*
- [ ] Android parity
- [ ] Lucid dream session mode

---

## 🤝 Contributing

This is a hackathon project, but if it speaks to you - open an issue, send a thought, share a dream.

The bar for contribution is simple: **does this make Dream Thread feel more like a Moleskine, and less like a dashboard?**

If yes, we want to hear from you.

---

## 📜 License

MIT - *you own your dreams, and you own this code.*

---

<div align="center">

### ☾ &nbsp; The AI listens. Reflects your mood. Never tells you what it means. &nbsp; ☾

*Your dreams, captured.&nbsp;&nbsp;Your meaning, yours.*

`dreamthread.app` · *built at Cursor Hackathon 2026*

```
   ·    ✦         ⋆    ·
        ·    ☾        ✧
   ✦         ·     
        ⋆        ✦   ·
```

</div>
# In the folder where you want the repo
git clone git@github.com:clementinepujiutami/dream-thread.git
cd dream-thread

# Copy the README from your downloads
cp ~/Downloads/README.md .

# Push it up
git add README.md
git commit -m "✦ add dreamy README"
git push origin main
