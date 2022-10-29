import { XSound } from '@service/domain/x-sounds/x-sound';

interface XSoundsResponseDto {
  sounds: XSound[],
}

interface XSoundsTagsResponseDto {
  tags: string[],
}

export { XSoundsResponseDto, XSoundsTagsResponseDto };
