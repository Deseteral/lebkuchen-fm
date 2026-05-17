import { createSignal, createMemo } from 'solid-js';
import { Tabs, Tab } from '@components/Tabs/Tabs';
import { Input } from '@components/Input/Input';
import { Button } from '@components/Button/Button';
import { SecretField } from '@components/SecretField/SecretField';
import {
  IntegrationsResponse,
  IntegrationsPatchRequest,
  patchIntegrations,
} from '../../../../services/integrations-service';
import styles from './IntegrationsSettings.module.css';

interface IntegrationsSettingsProps {
  data: IntegrationsResponse;
  close: () => void;
}

function isSecretDirty(value: string | null): boolean {
  return value !== null;
}

function buildSecretPatch(value: string | null): string | undefined {
  if (value === null) return undefined;
  return value;
}

function buildFieldPatch(current: string, initial: string): string | undefined {
  if (current === initial) return undefined;
  return current;
}

function IntegrationsSettings(props: IntegrationsSettingsProps) {
  // eslint-disable-next-line solid/reactivity
  const data = props.data;
  const close = () => props.close();

  // YouTube state
  const [ytApiKey, setYtApiKey] = createSignal<string | null>(null);

  // Discord state
  const dcInitialChannelId = data.discord.channelId ?? '';
  const dcInitialCommandPrompt = data.discord.commandPrompt ?? '';
  const [dcToken, setDcToken] = createSignal<string | null>(null);
  const [dcChannelId, setDcChannelId] = createSignal(dcInitialChannelId);
  const [dcCommandPrompt, setDcCommandPrompt] = createSignal(dcInitialCommandPrompt);

  // Dropbox state
  const dbInitialXSoundsPath = data.dropbox.xSoundsPath ?? '';
  const [dbAppKey, setDbAppKey] = createSignal<string | null>(null);
  const [dbAppSecret, setDbAppSecret] = createSignal<string | null>(null);
  const [dbRefreshToken, setDbRefreshToken] = createSignal<string | null>(null);
  const [dbXSoundsPath, setDbXSoundsPath] = createSignal(dbInitialXSoundsPath);

  // Saving state
  const [isSaving, setIsSaving] = createSignal(false);

  // Dirty tracking per tab
  const ytDirty = createMemo(() => isSecretDirty(ytApiKey()));

  const dcDirty = createMemo(
    () =>
      isSecretDirty(dcToken()) ||
      dcChannelId() !== dcInitialChannelId ||
      dcCommandPrompt() !== dcInitialCommandPrompt,
  );

  const dbDirty = createMemo(
    () =>
      isSecretDirty(dbAppKey()) ||
      isSecretDirty(dbAppSecret()) ||
      isSecretDirty(dbRefreshToken()) ||
      dbXSoundsPath() !== dbInitialXSoundsPath,
  );

  const anyDirty = createMemo(() => ytDirty() || dcDirty() || dbDirty());

  const tabDirtyByIndex = (index: number): boolean => {
    switch (index) {
      case 0:
        return ytDirty();
      case 1:
        return dcDirty();
      case 2:
        return dbDirty();
      default:
        return false;
    }
  };

  // Build patch for a specific tab
  const buildYoutubePatch = () => {
    const apiKey = buildSecretPatch(ytApiKey());
    if (apiKey === undefined) return undefined;
    return { apiKey };
  };

  const buildDiscordPatch = () => {
    const token = buildSecretPatch(dcToken());
    const channelId = buildFieldPatch(dcChannelId(), dcInitialChannelId);
    const commandPrompt = buildFieldPatch(dcCommandPrompt(), dcInitialCommandPrompt);
    if (token === undefined && channelId === undefined && commandPrompt === undefined)
      return undefined;
    return {
      ...(token !== undefined && { token }),
      ...(channelId !== undefined && { channelId }),
      ...(commandPrompt !== undefined && { commandPrompt }),
    };
  };

  const buildDropboxPatch = () => {
    const appKey = buildSecretPatch(dbAppKey());
    const appSecret = buildSecretPatch(dbAppSecret());
    const refreshToken = buildSecretPatch(dbRefreshToken());
    const xSoundsPath = buildFieldPatch(dbXSoundsPath(), dbInitialXSoundsPath);
    if (
      appKey === undefined &&
      appSecret === undefined &&
      refreshToken === undefined &&
      xSoundsPath === undefined
    )
      return undefined;
    return {
      ...(appKey !== undefined && { appKey }),
      ...(appSecret !== undefined && { appSecret }),
      ...(refreshToken !== undefined && { refreshToken }),
      ...(xSoundsPath !== undefined && { xSoundsPath }),
    };
  };

  const buildFullPatch = (): IntegrationsPatchRequest => ({
    ...(buildYoutubePatch() && { youtube: buildYoutubePatch() }),
    ...(buildDiscordPatch() && { discord: buildDiscordPatch() }),
    ...(buildDropboxPatch() && { dropbox: buildDropboxPatch() }),
  });

  const buildTabPatch = (index: number): IntegrationsPatchRequest => {
    switch (index) {
      case 0:
        return { youtube: buildYoutubePatch() };
      case 1:
        return { discord: buildDiscordPatch() };
      case 2:
        return { dropbox: buildDropboxPatch() };
      default:
        return {};
    }
  };

  const applyPatch = async (patch: IntegrationsPatchRequest) => {
    setIsSaving(true);
    try {
      await patchIntegrations(patch);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async (activeIndex: number) => {
    if (!tabDirtyByIndex(activeIndex)) return;
    await applyPatch(buildTabPatch(activeIndex));
    close();
  };

  const handleOk = async () => {
    if (anyDirty()) {
      await applyPatch(buildFullPatch());
    }
    close();
  };

  const handleCancel = () => {
    if (anyDirty()) {
      if (!confirm('You have unsaved changes. Discard them?')) return;
    }
    close();
  };

  const dirtyMarker = (isDirty: boolean) => (isDirty ? '* ' : '');

  const tabs: Tab[] = [
    {
      label: () => (
        <>
          <span class={styles.dirtyMarker}>{ytDirty() ? '*' : ''}</span>
          YouTube
        </>
      ),
      content: () => (
        <div class={styles.fields}>
          <label class={styles.field}>
            <span class={styles.label}>{dirtyMarker(isSecretDirty(ytApiKey()))}API Key</span>
            <SecretField
              suffix={data.youtube.apiKey.suffix}
              secretLength={data.youtube.apiKey.length}
              isSet={data.youtube.apiKey.set}
              value={ytApiKey()}
              onChange={setYtApiKey}
            />
          </label>
        </div>
      ),
    },
    {
      label: () => (
        <>
          <span class={styles.dirtyMarker}>{dcDirty() ? '*' : ''}</span>
          Discord
        </>
      ),
      content: () => (
        <div class={styles.fields}>
          <label class={styles.field}>
            <span class={styles.label}>{dirtyMarker(isSecretDirty(dcToken()))}Token</span>
            <SecretField
              suffix={data.discord.token.suffix}
              secretLength={data.discord.token.length}
              isSet={data.discord.token.set}
              value={dcToken()}
              onChange={setDcToken}
            />
          </label>
          <label class={styles.field}>
            <span class={styles.label}>
              {dirtyMarker(dcChannelId() !== dcInitialChannelId)}Channel ID
            </span>
            <Input value={dcChannelId()} onInput={(e) => setDcChannelId(e.currentTarget.value)} />
          </label>
          <label class={styles.field}>
            <span class={styles.label}>
              {dirtyMarker(dcCommandPrompt() !== dcInitialCommandPrompt)}Prompt
            </span>
            <Input
              value={dcCommandPrompt()}
              onInput={(e) => setDcCommandPrompt(e.currentTarget.value)}
            />
          </label>
        </div>
      ),
    },
    {
      label: () => (
        <>
          <span class={styles.dirtyMarker}>{dbDirty() ? '*' : ''}</span>
          Dropbox
        </>
      ),
      content: () => (
        <div class={styles.fields}>
          <label class={styles.field}>
            <span class={styles.label}>{dirtyMarker(isSecretDirty(dbAppKey()))}App Key</span>
            <SecretField
              suffix={data.dropbox.appKey.suffix}
              secretLength={data.dropbox.appKey.length}
              isSet={data.dropbox.appKey.set}
              value={dbAppKey()}
              onChange={setDbAppKey}
            />
          </label>
          <label class={styles.field}>
            <span class={styles.label}>{dirtyMarker(isSecretDirty(dbAppSecret()))}App Secret</span>
            <SecretField
              suffix={data.dropbox.appSecret.suffix}
              secretLength={data.dropbox.appSecret.length}
              isSet={data.dropbox.appSecret.set}
              value={dbAppSecret()}
              onChange={setDbAppSecret}
            />
          </label>
          <label class={styles.field}>
            <span class={styles.label}>
              {dirtyMarker(isSecretDirty(dbRefreshToken()))}Refresh Token
            </span>
            <SecretField
              suffix={data.dropbox.refreshToken.suffix}
              secretLength={data.dropbox.refreshToken.length}
              isSet={data.dropbox.refreshToken.set}
              value={dbRefreshToken()}
              onChange={setDbRefreshToken}
            />
          </label>
          <label class={styles.field}>
            <span class={styles.label}>
              {dirtyMarker(dbXSoundsPath() !== dbInitialXSoundsPath)}Sounds Path
            </span>
            <Input
              value={dbXSoundsPath()}
              onInput={(e) => setDbXSoundsPath(e.currentTarget.value)}
            />
          </label>
        </div>
      ),
    },
  ];

  return (
    <div class={styles.container}>
      <Tabs
        tabs={tabs}
        footer={(activeIndex) => (
          <>
            <Button
              onClick={() => handleApply(activeIndex())}
              disabled={isSaving() || !tabDirtyByIndex(activeIndex())}
            >
              Apply
            </Button>
            <div class={styles.rightButtons}>
              <Button onClick={handleOk} disabled={isSaving()}>
                OK
              </Button>
              <Button onClick={handleCancel} disabled={isSaving()}>
                Cancel
              </Button>
            </div>
          </>
        )}
      />
    </div>
  );
}

export { IntegrationsSettings };
