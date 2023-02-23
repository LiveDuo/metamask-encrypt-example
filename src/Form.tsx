import React from "react";

const context = React.createContext("");

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} name="message" />;
}

export function FormSubmit({
  children,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLElement>>) {
  return (
    <button {...props} type="submit">
      {children}
    </button>
  );
}
export function FormResult(props: React.HTMLAttributes<HTMLParagraphElement>) {
  const result = React.useContext(context);
  return <p>{result}</p>;
}

type Props = {
  onSubmit: (text: string) => Promise<string> | string | void;
};

export function Form({ onSubmit, children }: React.PropsWithChildren<Props>) {
  const [result, setResult] = React.useState("");
  const submit: React.FormEventHandler<any> = async (e) => {
    e.preventDefault();
    const res = await onSubmit(e.currentTarget.elements.message.value);
    if (res) setResult(res);
  };
  return (
    <context.Provider value={result}>
      <form onSubmit={submit}>{children}</form>
    </context.Provider>
  );
}
