import { useState, useCallback, ChangeEvent } from 'react';
import { GenericStatus } from '@/lib/shared/enums/generic-status';
import { uploadFile } from '@/lib/utils/upload-file';

export interface IRegisterMethodReturn {
  file: File | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  status: GenericStatus;
  clearAction: () => void;
}

export const useFileHandler = <T extends string> (config: Record<T, string>) => {
  const [files, setFiles] = useState<Record<T, File>>(() => {
    return {} as Record<T, File>;
  });
  const [status, setStatus] = useState<Record<T, GenericStatus>>(() => {
    const initial = {} as Record<T, GenericStatus>;
    for (const key in config) {
      initial[key] = GenericStatus.IDLE;
    }
    return initial;
  });

  const onChangeFile = useCallback((key: T) => (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(prev => ({ ...prev, [key]: e.target.files?.[0] }));
    setStatus(prev => ({ ...prev, [key]: GenericStatus.IDLE }));
  }, []);

  const clearFile = useCallback((key: T) => {
    setFiles(prev => ({ ...prev, [key]: undefined }));
    setStatus(prev => ({ ...prev, [key]: GenericStatus.IDLE }));
  }, []);

  const uploadFiles = useCallback(async (): Promise<Record<string, string>> => {
    const result: Record<string, string> = {};

    for (const key in config) {
      if (!files[key]) {
        throw new Error(`File for "${key}" is not selected.`);
      }
    }

    for (const key in files) {
      const file = files[key];
      const path = config[key];
      const filename = `${Date.now()}_${key}`;

      if (!(file instanceof File)) {
        console.warn(`Skipping upload for ${key} as it is not a valid file.`);
        continue;
      }

      if (!path) {
        console.warn(`No storage path configured for key: ${key}`);
        continue;
      }

      setStatus(prev => ({ ...prev, [key]: GenericStatus.EXECUTING }));

      try {
        const url = await uploadFile({ destination: path, file, filename });

        result[key] = url;

        setStatus(prev => ({ ...prev, [key]: GenericStatus.SUCCESS }));
      } catch (error) {
        console.error(`Error uploading ${key}:`, error);
        setStatus(prev => ({ ...prev, [key]: GenericStatus.ERROR }));
      }
    }

    return result;
  }, [files, config]);

  const registerInput = useCallback((key: T) => ({
    onChange: onChangeFile(key),
    file: files[key],
    status: status[key],
    clearAction: () => clearFile(key),
  }), [files, onChangeFile, status, clearFile]);

  return { onChangeFile, uploadFiles, clearFile, files, status, registerInput };
};
