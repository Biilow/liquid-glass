# Liquid Glass

A theme mod for Claude Code sessions in the Claude desktop app. Panels frost over a moving backdrop you pick, with a tint, strength and blur of your choosing.

Type `/glass` to open the settings panel: backdrop, tint, strength, blur, motion and glass messages. Changes apply at once and are remembered. `/glass motion lively` and the like set one from the keyboard, and `/glass reset` restores the defaults.

Twenty-two backdrops and Photo wash, from felt and paper textures to shader scenes like water ripples, clouds and halftone. All art is drawn in code; no images are bundled.

**Photo wash** makes a backdrop from a photo of yours: `/glass-photo ~/Pictures/beach.jpg`, or paste the path into the field under the backdrops in the panel. The photo is shrunk on your Mac to six colours with the built-in `sips` tool; only those colours are kept, and nothing is sent anywhere. macOS only.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install liquid-glass --marketplace Biilow/liquid-glass
```

From a shell:

```bash
claude plugin install liquid-glass --marketplace Biilow/liquid-glass
```

Answer `y` to add the marketplace, then pick a scope (user is first). In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `Biilow/liquid-glass`, then Add plugin. Start a new session afterwards, then type `/glass`.

## Licence

MIT, see `LICENSE`, except `hooks/make-colors.js` and `hooks/make-colors.d.ts`, which are copied unchanged from Anthropic's Claude Code mod kit and remain Anthropic's.

An independent fan project, not affiliated with or endorsed by Apple or Anthropic.
