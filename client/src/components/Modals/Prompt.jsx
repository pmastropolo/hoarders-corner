import Button from "../Atoms/Button"; // IMPORT BUTTON COMPONENT

export default function Prompt({
  heading, // PROP: PROMPT HEADING
  body, // PROP: PROMPT BODY CONTENT
  priLabel, // PROP: PRIMARY BUTTON LABEL
  secLabel, // PROP: SECONDARY BUTTON LABEL
  priStyle, // PROP: PRIMARY BUTTON STYLE
  secStyle, // PROP: SECONDARY BUTTON STYLE
  priAction, // PROP: PRIMARY BUTTON ACTION
  secAction, // PROP: SECONDARY BUTTON ACTION
}) {
  return (
    <div className="bg-[#00000080] w-screen h-screen absolute top-0 left-0 flex items-center"> // OVERLAY STYLING FOR PROMPT
      <div className="bg-neu-0 w-[560px] p-8 mx-auto rounded-lg flex flex-col gap-6"> // CONTAINER FOR PROMPT CONTENT
        <h2 className="text-h2 font-bold w-full">{heading}</h2> // DISPLAY PROMPT HEADING
        {body} // DISPLAY PROMPT BODY
        <div className="flex gap-4 w-full justify-end"> // BUTTONS CONTAINER
          <Button label={secLabel} style={secStyle} action={secAction} /> // SECONDARY BUTTON
          <Button label={priLabel} style={priStyle} action={priAction} /> // PRIMARY BUTTON
        </div>
      </div>
    </div>
  );
}
