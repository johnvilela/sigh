import { classHelper } from "@/lib/utils/class-helper";
import { ElementType, useState } from "react";
import { Text } from "./text";
import { Button } from "./button";
import { CircleAlert, CircleCheck, Download, LoaderCircle, Trash } from "lucide-react";
import { GenericStatus } from "@/lib/shared/enums/generic-status";
import { IRegisterMethodReturn } from "@/hooks/use-file-handler";

interface InputProps extends React.ComponentProps<'input'> {
  hook: IRegisterMethodReturn;
  fileUrl?: string;
  error?: string;
  label?: string;
  showLabel?: boolean;
  spanMsg?: string;
  divClassName?: string;
  labelClassName?: string;
  icon?: ElementType;
}

export function FileInput ({ id, showLabel = false, label, name, spanMsg, divClassName, labelClassName, icon: Icon, hook, fileUrl, ...props }: InputProps) {
  const [renderFileDetail, setRenderFileDetail] = useState(!!fileUrl || false);

  const clearInput = () => {
    hook.clearAction();
    setRenderFileDetail(false);
  };

  if (hook.file || renderFileDetail) {
    return (
      <div className={classHelper('w-full', divClassName)}>
        {showLabel && <p className="text-xs font-medium text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">{label}</p>}

        <div className={classHelper("p-3 h-28 flex flex-col justify-between border border-dashed rounded-md", labelClassName)}>
          <div>
            <Text variant="small" className="truncate">{hook.file?.name || fileUrl}</Text >
            <Text variant="muted" className=" ">{label}</Text >
          </div>
          <div className="flex justify-end gap-2">
            {hook.status === GenericStatus.IDLE ? (
              <>
                {renderFileDetail && <Button variant="ghost" size='icon'>
                  <Download />
                </Button>}
                <Button variant="ghost" size='icon' className="text-destructive hover:text-destructive" onClick={clearInput}>
                  <Trash />
                </Button>
              </>
            ) : (
              <div className="size-9 grid place-items-center">
                {hook.status === GenericStatus.EXECUTING && <LoaderCircle className="animate-spin" />}
                {hook.status === GenericStatus.SUCCESS && <CircleCheck className="text-primary" />}
                {hook.status === GenericStatus.ERROR && <CircleAlert className="text-destructive" />}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={classHelper('w-full', divClassName)}>
      {showLabel && <p className="text-xs font-medium text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">{label}</p>}
      <label
        htmlFor={id}
        className={classHelper("flex flex-col items-center justify-center border border-dashed bg-gray-100 border-gray-300 rounded-md p-3 h-28 cursor-pointer hover:border-primary transition-colors relative", labelClassName)}
        onDragOver={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={e => {
          e.preventDefault();
          e.stopPropagation();
          const file = e.dataTransfer.files[0];
          if (file) {
            // Manually set the file in react-hook-form
            document.querySelector<HTMLInputElement>(`input[type="file"][name=${name}]`)!.files = e.dataTransfer.files;
            // Optionally, trigger a change event
            const event = new Event('change', { bubbles: true });
            document.querySelector<HTMLInputElement>(`input[type="file"][name=${name}]`)!.dispatchEvent(event);
          }
        }}
      >
        <input
          id={id}
          type="file"
          className="hidden"
          name={name}
          onChange={hook.onChange}
          {...props}
        />
        {Icon && <Icon className="text-gray-400 mb-2" />}
        <span className={Icon ? "text-gray-400 text-center text-xs" : "text-gray-400 text-center"}>{spanMsg ?? "Clique ou arraste para anexar o arquivo"}</span>
      </label>
    </div>
  )
}