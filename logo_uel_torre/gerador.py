import random, math
random.seed(5)
defs=[]; body=[]; cid=[0]

def blob(cx,cy,rx,ry,n=10,jit=0.07,seed=0):
    r=random.Random(seed)
    pts=[(cx+rx*(1+r.uniform(-jit,jit))*math.cos(2*math.pi*i/n),
          cy+ry*(1+r.uniform(-jit,jit))*math.sin(2*math.pi*i/n)) for i in range(n)]
    d=""
    for i in range(n):
        p0,p1,p2,p3=pts[i-1],pts[i],pts[(i+1)%n],pts[(i+2)%n]
        c1=(p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6)
        c2=(p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6)
        if i==0: d+=f"M{p1[0]:.1f} {p1[1]:.1f}"
        d+=f"C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}"
    return d+"Z"

def poly(pts): return "M"+"L".join(f"{x} {y}" for x,y in pts)+"Z"

def scribble(d,bbox,color,angle=-35,gap=7,w=4.2,op=.9,seed=1,second=False):
    r=random.Random(seed); cid[0]+=1; c=f"c{cid[0]}"
    defs.append(f'<clipPath id="{c}"><path d="{d}"/></clipPath>')
    x0,y0,x1,y1=bbox; cx,cy=(x0+x1)/2,(y0+y1)/2
    R=math.hypot(x1-x0,y1-y0)/2+10
    def zig(a,gap):
        a=math.radians(a); ca,sa=math.cos(a),math.sin(a); pts=[]; k=0; t=-R
        while t<R:
            u1,u2=(-R-r.uniform(0,8),R+r.uniform(0,8))
            if k%2: u1,u2=u2,u1
            for u in (u1,u2):
                v=t+r.uniform(-1.5,1.5)
                pts.append((cx+u*ca-v*sa,cy+u*sa+v*ca))
            t+=gap*r.uniform(.8,1.2); k+=1
        return "M"+"L".join(f"{x:.1f} {y:.1f}" for x,y in pts)
    s=f'<g clip-path="url(#{c})"><path d="{zig(angle,gap)}" stroke="{color}" stroke-width="{w}" fill="none" opacity="{op}"/>'
    if second: s+=f'<path d="{zig(angle+70,gap*1.6)}" stroke="{color}" stroke-width="{w*.7}" fill="none" opacity="{op*.6}"/>'
    body.append(s+'</g>')

PEN="#2B2A33"
def line(d,w=3.6,col=PEN,fill="none"): body.append(f'<path d="{d}" stroke="{col}" stroke-width="{w}" fill="{fill}" class="pen"/>')

# ---- landscape
body.append('<g>')
sky=poly([(150,150),(930,150),(930,700),(150,700)])
scribble(sky,(150,150,930,700),"#BFE3F2",angle=-8,gap=15,w=6,op=.55,seed=2)
sun=blob(380,300,46,46,seed=3)
scribble(sun,(330,250,430,350),"#F6B92E",angle=-40,gap=6,w=4.5,seed=4,second=True)
line(sun,3)
for a in range(0,360,40):
    x=380+math.cos(math.radians(a)); y=300+math.sin(math.radians(a))
    line(f"M{380+62*x-380+0:.1f} {300+62*(y-300):.1f}L{380+82*x-380:.1f} {300+82*(y-300):.1f}",3.4,"#E39A12")
def cloud(cx,cy,s):
    d=f"M{cx-50*s} {cy}c-26 0-26-34 0-34c4-26 40-30 50-8c24-12 52 4 44 26c24 2 22 16 6 16z"
    line(d,3,"#7B8A93","#FFFFFF")
cloud(690,300,1); cloud(250,420,.7)
line("M560 240q10-12 20 0q10-12 20 0",3); line("M610 205q8-10 16 0q8-10 16 0",3)
body.append('</g><g transform="translate(0 -60)">')
far=poly([(150,700),(150,690)])+"M150 705C260 625 380 640 480 690C590 630 720 610 930 690L930 800L150 800Z"
scribble(far,(150,600,930,800),"#7CC4B3",angle=-30,gap=7,w=4.5,seed=6,second=True)
line("M150 705C260 625 380 640 480 690C590 630 720 610 930 690",3)
near="M150 745C300 695 450 705 560 735C700 695 820 700 930 735L930 990L150 990Z"
scribble(near,(150,690,930,990),"#86BE5C",angle=-50,gap=6,w=4.6,seed=7,second=True)
line("M150 745C300 695 450 705 560 735C700 695 820 700 930 735",3)

body.append('</g>')
# ---- kid builder
def kid(cx,cy,rx,ry,col,seed,legs,arms,hair,face_dx=0):
    b=blob(cx,cy,rx,ry,seed=seed)
    # white-ish paper underneath so landscape doesn't show through
    body.append(f'<path d="{b}" fill="#FBF3E4"/>')
    for d in legs: line(d,4)
    for d in arms: line(d,4)
    scribble(b,(cx-rx,cy-ry,cx+rx,cy+ry),col,angle=-35+seed*7,gap=6,w=4.4,seed=seed,second=True)
    line(b,3)
    for d in hair: line(d,3.2)
    fx=cx+face_dx
    body.append(f'<circle cx="{fx-rx*.32:.1f}" cy="{cy-ry*.12:.1f}" r="3.8" fill="{PEN}"/><circle cx="{fx+rx*.32:.1f}" cy="{cy-ry*.12:.1f}" r="3.8" fill="{PEN}"/>')
    line(f"M{fx-rx*.3:.1f} {cy+ry*.2:.1f}q{rx*.3:.1f} {ry*.34:.1f} {rx*.6:.1f} 0",3.4)

def cube(x,y,s,front,top,side,seed):
    f=poly([(x,y),(x+s,y),(x+s,y+s),(x,y+s)])
    t=poly([(x,y),(x+s*.3,y-s*.27),(x+s*1.3,y-s*.27),(x+s,y)])
    sd=poly([(x+s,y),(x+s*1.3,y-s*.27),(x+s*1.3,y+s*.73),(x+s,y+s)])
    body.append(f'<path d="{f}" fill="#FBF3E4"/><path d="{t}" fill="#FBF3E4"/><path d="{sd}" fill="#FBF3E4"/>')
    scribble(f,(x,y,x+s,y+s),front,-35,5.5,4.4,.95,seed,True)
    scribble(t,(x,y-s*.27,x+s*1.3,y),top,-20,5.5,4.2,.95,seed+1,True)
    scribble(sd,(x+s,y-s*.27,x+s*1.3,y+s),side,-60,5.5,4.4,.95,seed+2,True)
    for d in (f,t,sd): line(d,3.4)

body.append('<g transform="translate(0 -55) translate(540 745) scale(1.1) translate(-540 -745)">')
# kid C (back, small) - waving
kid(548,590,34,36,"#2F8F8A",3,
    ["M540 624L538 666","M556 624L560 666"],
    ["M520 595Q505 580 508 556","M576 592Q596 572 592 548"],
    ["M538 556q-6-14 4-18","M552 555q4-14 14-12"])
# tower: red base, yellow on top
cube(565,660,100,"#D8453C","#EE7468","#A82E28",10)
cube(565,560,100,"#F6C230","#FBDB6E","#D49C12",20)
# kid B right, reaching up to tower
kid(775,625,50,54,"#F08A72",5,
    ["M760 678L750 752","M790 678L802 748"],
    ["M728 610Q705 590 700 575","M735 635Q712 640 698 628"],
    ["M752 570q-8-16 6-20","M770 568q2-18 14-14","M788 574q10-12 18-4"],face_dx=6)
# blue cube being pushed, kid A left
cube(385,655,100,"#2F6FD0","#6A9BEA","#1F4FA0",30)
kid(283,622,54,58,"#A58BD6",7,
    ["M268 678L246 752","M300 676L318 748"],
    ["M326 612Q352 622 385 640","M322 640Q350 662 386 682"],
    ["M255 568l-10-18","M272 563l-4-20","M290 563l4-20","M306 569l12-16"],face_dx=4)

body.append("</g>")
svg_scene="\n".join(body); svg_defs="\n".join(defs)
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
<defs>
<filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
 <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/>
 <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" result="d"/>
 <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" result="g"/>
 <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.9 1.35" result="ga"/>
 <feComposite in="d" in2="ga" operator="in"/>
</filter>
<clipPath id="disc"><circle cx="540" cy="540" r="352"/></clipPath>
<path id="top" d="M540 932A392 392 0 0 1 540 148A392 392 0 0 1 540 932"/>
<path id="bot" d="M540 102A438 438 0 0 0 540 978A438 438 0 0 0 540 102"/>
{svg_defs}
</defs>
<style>.pen{{stroke-linecap:round;stroke-linejoin:round}} g.s path[fill="none"]{{stroke-linecap:round;stroke-linejoin:round}}</style>
<circle cx="540" cy="540" r="525" fill="#1F4E4A"/>
<circle cx="540" cy="540" r="352" fill="#FBF3E4"/>
<g clip-path="url(#disc)"><g class="s" filter="url(#pencil)" stroke-linecap="round" stroke-linejoin="round">
{svg_scene}
</g></g>
<circle cx="540" cy="540" r="368" fill="none" stroke="#E2A72E" stroke-width="5"/>
<g font-family="Inter, 'Liberation Sans', sans-serif" font-weight="700" font-size="46" fill="#F6EBD3">
<text text-anchor="middle"><textPath href="#top" startOffset="50%" textLength="1330" lengthAdjust="spacing">ESCOLARIZAÇÃO DE CRIANÇAS E ADOLESCENTES</textPath></text>
<text text-anchor="middle"><textPath href="#bot" startOffset="50%" textLength="900" lengthAdjust="spacing">COM AUTISMO E PSICOSE <tspan fill="#E2A72E">•</tspan> UEL</textPath></text>
</g>
<circle cx="153" cy="696" r="9" fill="#E2A72E"/><circle cx="927" cy="696" r="9" fill="#E2A72E"/>
</svg>'''
open("logo_uel_torre.svg","w").write(svg)
