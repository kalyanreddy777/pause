const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const search = `  return (
    <div id="impact" ref={containerRef} className="h-[350vh] w-full relative z-10 bg-white">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="relative w-[90vw] max-w-[1000px] aspect-[4/3] md:aspect-[2.2/1] max-h-[60vh]" style={{ perspective: '2000px' }}>
          {splitCards.map((card, i) => (
            <SplitCard 
              key={i} 
              card={card} 
              index={i} 
              progress={smoothProgress} 
            />
          ))}
        </div>
      </div>
    </div>
  );`;

const replace = `  return (
    <div id="impact" className="w-full relative z-10">
      <div ref={containerRef} className="hidden md:block h-[350vh] w-full relative bg-white">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="relative w-[90vw] max-w-[1000px] aspect-[4/3] md:aspect-[2.2/1] max-h-[60vh]" style={{ perspective: '2000px' }}>
            {splitCards.map((card, i) => (
              <SplitCard 
                key={i} 
                card={card} 
                index={i} 
                progress={smoothProgress} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="block md:hidden w-full relative bg-[#fcfcfc] pb-32 pt-12">
        <div className="px-4 mb-8">
          <h2 className="font-instrument text-[36px] tracking-tight text-[#1a1a1a] leading-none mb-2 text-center">
             Where are you in your journey?
          </h2>
        </div>
        <div className="relative flex flex-col space-y-4 px-4 pb-[10vh]">
          {splitCards.map((card, i) => (
            <div 
              key={i}
              className="sticky overflow-hidden rounded-[24px] shadow-2xl flex flex-col w-full min-h-[350px] p-6 justify-between border border-white/10"
              style={{ 
                top: \`\${120 + i * 20}px\`,
                background: card.bg,
                zIndex: i + 10
              }}
            >
              <div className="mb-4">
                 {i === 0 && <TrendingUp className="w-6 h-6 text-black/60 mb-6" />}
                 {i === 1 && (
                    <div className="flex flex-col items-start gap-[2px] mb-6">
                      <div className="w-[7px] h-[7px] rounded-full border-[1.5px] border-white/80" />
                      <div className="flex gap-[2px]">
                        <div className="w-[7px] h-[7px] rounded-full border-[1.5px] border-white/80" />
                        <div className="w-[7px] h-[7px] rounded-full border-[1.5px] border-white/80" />
                      </div>
                    </div>
                 )}
                 {i === 2 && <Sparkles className="w-6 h-6 text-white/50 mb-6" />}
                 <h3 className="font-instrument text-[32px] tracking-tight leading-[1.1] mb-2" style={{ color: card.titleColor }}>
                   {card.title}
                 </h3>
                 <p className="text-[15px] leading-[1.5]" style={{ color: card.descColor }}>
                   {card.description}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );`;

if(code.includes(search)) {
  fs.writeFileSync('src/App.tsx', code.replace(search, replace));
  console.log("Success");
} else {
  console.log("Failed to find exactly. Let's do a loose replace.");
  // Find substring starting with return (
  // and ending with </SplitCard>\n          ))}\n        </div>\n      </div>\n    </div>\n  );
  const re = /  return \(\n    <div id="impact"(.|\n)*?    <\/div>\n  \);/;
  if(re.test(code)) {
    fs.writeFileSync('src/App.tsx', code.replace(re, replace));
    console.log("Regex Replace Success");
  } else {
    console.log("Regex Replace Failed too");
  }
}
