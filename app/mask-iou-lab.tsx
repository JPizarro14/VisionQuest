"use client";
import { useState } from "react";

const groundTruth = new Set([6,7,8,11,12,13,16,17,18,22]);
const initialPrediction = [7,8,11,12,13,16,21,23];

export function MaskIouLab() {
  const [prediction, setPrediction] = useState<Set<number>>(() => new Set(initialPrediction));
  const tp = [...groundTruth].filter(i => prediction.has(i)).length;
  const fp = [...prediction].filter(i => !groundTruth.has(i)).length;
  const fn = groundTruth.size - tp;
  const union = tp + fp + fn;
  function toggle(i: number) {
    setPrediction(current => {
      const next = new Set(current);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }
  return <>
    <div className="mask-lab-legend" aria-hidden="true"><span>■ Coinciden (TP)</span><span>■ Solo predicción (FP)</span><span>■ Solo real (FN)</span></div>
    <div className="mask-lab-grid" role="group" aria-label="Máscara real fija y máscara predicha editable de 5 por 5">
      {Array.from({length:25},(_,i)=>{
        const gt=groundTruth.has(i), pred=prediction.has(i);
        const state=gt&&pred?"tp":gt?"fn":pred?"fp":"empty";
        const label=state==="tp"?"acierto":state==="fn"?"objeto omitido":state==="fp"?"falsa predicción":"fondo";
        return <button key={i} type="button" data-mask-state={state} onClick={()=>toggle(i)}
          aria-label={"Fila "+(Math.floor(i/5)+1)+", columna "+(i%5+1)+": "+label+". Pulsar para alternar predicción."}
          aria-pressed={pred}>{state==="empty"?"·":state==="tp"?"✓":state==="fn"?"G":"+"}</button>;
      })}
    </div>
    <div className="lab-readout lab-readout-grid">
      <div><span>TP / FP / FN</span><strong>{tp} / {fp} / {fn}</strong></div>
      <div><span>UNIÓN</span><strong>{union} píxeles</strong></div>
      <div><span>IoU = TP / UNIÓN</span><strong>{(tp/union).toFixed(3)}</strong></div>
      <div><span>DICE = 2TP / (2TP+FP+FN)</span><strong>{(2*tp/(2*tp+fp+fn)).toFixed(3)}</strong></div>
    </div>
    <p className="lab-caption">La G marca objeto real omitido; + es una falsa predicción. La máscara real tiene diez píxeles y permanece fija.</p>
  </>;
}
