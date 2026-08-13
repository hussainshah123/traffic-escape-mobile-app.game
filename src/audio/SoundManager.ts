import Sound from 'react-native-sound';

export type SfxName =
  | 'click'
  | 'move'
  | 'blocked'
  | 'win'
  | 'lose'
  | 'star'
  | 'coin';

const FILES: SfxName[] = ['click', 'move', 'blocked', 'win', 'lose', 'star', 'coin'];

class SoundManagerImpl {
  private sounds: Partial<Record<SfxName, Sound>> = {};
  private enabled = true;
  private loaded = false;

  init() {
    if (this.loaded) return;
    this.loaded = true;
    Sound.setCategory('Ambient', true);
    FILES.forEach(name => {
      const s = new Sound(`${name}.wav`, Sound.MAIN_BUNDLE, err => {
        if (!err) this.sounds[name] = s;
      });
    });
  }

  setEnabled(on: boolean) {
    this.enabled = on;
  }

  play(name: SfxName) {
    if (!this.enabled) return;
    const s = this.sounds[name];
    if (!s) return;
    s.stop(() => {
      s.setCurrentTime(0);
      s.play();
    });
  }
}

export const SoundManager = new SoundManagerImpl();
