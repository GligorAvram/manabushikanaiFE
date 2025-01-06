import { PitchAccentEnum } from '@models/Api';

export const ACCENT_COLORS: Record<PitchAccentEnum, string> = {
    [PitchAccentEnum.NONE]     : '#000000',
    [PitchAccentEnum.ATAMADAKA]: '#ff0000',
    [PitchAccentEnum.HEIBAN]   : '#4169E1',
    [PitchAccentEnum.NAKADAKA2]: '#FFA500',
    [PitchAccentEnum.NAKADAKA3]: '#FF9E2C',
    [PitchAccentEnum.NAKADAKA4]: '#FF7F32',
    [PitchAccentEnum.NAKADAKA5]: '#FF5A00',
    [PitchAccentEnum.NAKADAKA6]: '#CC5500',
    [PitchAccentEnum.NAKADAKA7]: '#B87333',
    [PitchAccentEnum.NAKADAKA8]: '#FF4500',
    [PitchAccentEnum.OODAKA]   : '#00FF00'
};
