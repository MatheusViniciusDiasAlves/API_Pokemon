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
SPEC=["#E8615A","#F29A4A","#F5C842","#8CC152","#3FB5A8","#4F86D9","#8E6CC9"]
def line(d,w=3.6,col=PEN,fill="none"): body.append(f'<path d="{d}" stroke="{col}" stroke-width="{w}" fill="{fill}" class="pen"/>')

# ---- landscape
body.append('<g>')
sky=poly([(150,150),(930,150),(930,700),(150,700)])
scribble(sky,(150,150,930,700),"#BFE3F2",angle=-8,gap=15,w=6,op=.55,seed=2)
hz=poly([(150,430),(930,430),(930,700),(150,700)])
scribble(hz,(150,430,930,700),"#FFD3B0",angle=-6,gap=16,w=6,op=.5,seed=12)
sun=blob(380,300,46,46,seed=3)
scribble(sun,(330,250,430,350),"#F6B92E",angle=-40,gap=6,w=4.5,seed=4,second=True)
line(sun,3)
for i,a in enumerate(range(0,360,30)):
    ca,sa=math.cos(math.radians(a)),math.sin(math.radians(a))
    line(f"M{380+60*ca:.1f} {300+60*sa:.1f}L{380+84*ca:.1f} {300+84*sa:.1f}",5,SPEC[i%7])
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

# ---- school on the far hill
def school(x,y):
    wall=poly([(x,y),(x+100,y),(x+100,y+80),(x,y+80)])
    roof=poly([(x-10,y),(x+50,y-38),(x+110,y)])
    tower=poly([(x+38,y-30),(x+62,y-30),(x+62,y-62),(x+38,y-62)])
    troof=poly([(x+33,y-62),(x+50,y-82),(x+67,y-62)])
    for d,bb,c,sd in ((tower,(x+38,y-62,x+62,y-30),"#F7E3C4",40),(wall,(x,y,x+100,y+80),"#F6D8A8",41),
                      (roof,(x-10,y-38,x+110,y),"#C4502F",42),(troof,(x+33,y-82,x+67,y-62),"#C4502F",43)):
        body.append(f'<path d="{d}" fill="#FBF3E4"/>'); scribble(d,bb,c,-35,5,4,.95,sd,True); line(d,3)
    body.append(f'<circle cx="{x+50}" cy="{y-45}" r="6" fill="#F5C842" stroke="{PEN}" stroke-width="2.4"/>')
    line(f"M{x+50} {y-82}V{y-106}",3); flag=poly([(x+50,y-106),(x+72,y-100),(x+50,y-93)])
    body.append(f'<path d="{flag}" fill="#3FB5A8" stroke="{PEN}" stroke-width="2.4"/>')
    door=f"M{x+38} {y+80}V{y+48}q12-16 24 0V{y+80}Z"
    body.append(f'<path d="{door}" fill="#3FB5A8"/>'); line(door,3)
    for wx in (x+10,x+72):
        w=poly([(wx,y+18),(wx+18,y+18),(wx+18,y+36),(wx,y+36)])
        body.append(f'<path d="{w}" fill="#BFE3F2"/>'); line(w,2.6); line(f"M{wx+9} {y+18}V{y+36}M{wx} {y+27}H{wx+18}",2)
body.append('<g transform="translate(0 -60)">')
school(395,592)
body.append('</g>')

# ---- spectrum path (crayon stripes) from school door to foreground
def bez(p0,p1,p2,p3,t):
    u=1-t; return tuple(u**3*a+3*u*u*t*b+3*u*t*t*c+t**3*d for a,b,c,d in zip(p0,p1,p2,p3))
segs=[((445,590),(470,640),(610,655),(552,720)),((552,720),(495,790),(575,840),(545,960))]
cl=[]
for sg in segs:
    for k in range(40): cl.append(bez(*sg,k/40))
cl.append(segs[-1][3])
def width(y): return 14+max(0,(y-590))/(900-590)*250
edges=[]
for i,(x,y) in enumerate(cl):
    a=cl[max(i-1,0)]; b=cl[min(i+1,len(cl)-1)]
    dx,dy=b[0]-a[0],b[1]-a[1]; L=math.hypot(dx,dy) or 1; nx,ny=-dy/L,dx/L
    edges.append((x,y,nx,ny,width(y)))
N=len(SPEC)
for k,col in enumerate(SPEC):
    f0,f1=-.5+k/N,-.5+(k+1)/N
    left=[(x+nx*w*f0,y+ny*w*f0) for x,y,nx,ny,w in edges]
    right=[(x+nx*w*f1,y+ny*w*f1) for x,y,nx,ny,w in edges][::-1]
    d="M"+"L".join(f"{px:.1f} {py:.1f}" for px,py in left+right)+"Z"
    body.append(f'<path d="{d}" fill="#FBF3E4"/>')
    scribble(d,(250,580,830,980),col,-55+k*4,6,4.2,.78,60+k,True)
for f in (-.5,.5):
    line("M"+"L".join(f"{x+nx*w*f:.1f} {y+ny*w*f:.1f}" for x,y,nx,ny,w in edges),3)

# ---- little flowers
def flower(x,y,col,seed):
    line(f"M{x} {y}q-6 24 3 46",3.4,"#4E8A2A")
    for k in range(5):
        a=math.radians(k*72-90); px,py=x+14*math.cos(a),y+14*math.sin(a)
        body.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="10" fill="{col}" stroke="{PEN}" stroke-width="2.6"/>')
    body.append(f'<circle cx="{x}" cy="{y}" r="7" fill="#FFF7E6" stroke="{PEN}" stroke-width="2.6"/>')
for i,(x,y) in enumerate([(285,775),(360,830),(300,860),(745,770),(810,815),(715,850)]):
    flower(x,y,SPEC[(i*3)%7],i)

# ---- kid builder
def limb(p0,p1,s,skin,ctrl=None,w=9):
    d=f"M{p0[0]:.1f} {p0[1]:.1f}"+(f"Q{ctrl[0]:.1f} {ctrl[1]:.1f} " if ctrl else "L")+f"{p1[0]:.1f} {p1[1]:.1f}"
    body.append(f'<path d="{d}" stroke="{PEN}" stroke-width="{(w+3.4)*s:.1f}" fill="none" class="pen"/>')
    body.append(f'<path d="{d}" stroke="{skin}" stroke-width="{w*s:.1f}" fill="none" class="pen"/>')

def kid(cx,gy,s,skin,hair,shirt,pants,style,legs,arms,seed,face_dx=0,phones=None):
    hip=gy-50*s; sy=gy-106*s; hy=gy-134*s; hr=30*s
    # legs (skin) then shoes
    for fx in legs:
        limb((cx+(-9 if fx<cx else 9)*s,hip),(fx,gy-5*s),s,skin,w=10)
        sh=blob(fx+(4*s if fx>=cx else -4*s),gy-3*s,13*s,7*s,seed=seed)
        body.append(f'<path d="{sh}" fill="#FBF3E4"/>')
        scribble(sh,(fx-20*s,gy-12*s,fx+20*s,gy+6*s),"#3B3B52",-20,4,3.6,.95,seed)
        line(sh,2.6)
    # shorts
    sh_d=poly([(cx-26*s,hip-4*s),(cx+26*s,hip-4*s),(cx+29*s,hip+24*s),(cx+3*s,hip+24*s),(cx,hip+10*s),(cx-3*s,hip+24*s),(cx-29*s,hip+24*s)])
    body.append(f'<path d="{sh_d}" fill="#FBF3E4"/>')
    scribble(sh_d,(cx-29*s,hip-4*s,cx+29*s,hip+24*s),pants,-40,5,4.2,.95,seed+1,True); line(sh_d,3)
    # torso (shirt)
    t=f"M{cx-25*s:.1f} {sy:.1f}Q{cx:.1f} {sy-9*s:.1f} {cx+25*s:.1f} {sy:.1f}L{cx+28*s:.1f} {hip:.1f}L{cx-28*s:.1f} {hip:.1f}Z"
    body.append(f'<path d="{t}" fill="#FBF3E4"/>')
    scribble(t,(cx-28*s,sy-9*s,cx+28*s,hip),shirt,-30,5,4.3,.95,seed+2,True); line(t,3)
    # arms
    for (sx,hand,ctrl) in arms:
        limb((sx,sy+6*s),hand,s,skin,ctrl,w=8)
        body.append(f'<circle cx="{hand[0]:.1f}" cy="{hand[1]:.1f}" r="{6.5*s:.1f}" fill="{skin}" stroke="{PEN}" stroke-width="2.6"/>')
    # neck + head
    body.append(f'<rect x="{cx-6*s:.1f}" y="{hy+hr-6*s:.1f}" width="{12*s:.1f}" height="{14*s:.1f}" fill="{skin}" stroke="{PEN}" stroke-width="2.4"/>')
    for ex in (-1,1):
        e=blob(cx+ex*hr*1.0,hy+3*s,6*s,8*s,6,seed=seed); body.append(f'<path d="{e}" fill="{skin}" stroke="{PEN}" stroke-width="2.4"/>')
    h=blob(cx,hy,hr,hr*1.04,seed=seed+3,jit=.03)
    body.append(f'<path d="{h}" fill="#FBF3E4"/>')
    scribble(h,(cx-hr,hy-hr,cx+hr,hy+hr),skin,-35,5.5,4.2,.9,seed+3); line(h,3)
    # hair
    cap=f"M{cx-hr*1.02:.1f} {hy+2*s:.1f}Q{cx-hr*1.15:.1f} {hy-hr*1.15:.1f} {cx:.1f} {hy-hr*1.1:.1f}Q{cx+hr*1.15:.1f} {hy-hr*1.15:.1f} {cx+hr*1.02:.1f} {hy+2*s:.1f}Q{cx+hr*.6:.1f} {hy-hr*.5:.1f} {cx+hr*.1:.1f} {hy-hr*.45:.1f}Q{cx-hr*.5:.1f} {hy-hr*.4:.1f} {cx-hr*1.02:.1f} {hy+2*s:.1f}Z"
    parts=[cap]
    if style=="pigtails":
        parts+= [blob(cx-hr*1.25,hy+10*s,10*s,15*s,seed=seed),blob(cx+hr*1.25,hy+10*s,10*s,15*s,seed=seed+1)]
    if style=="curly":
        parts+= [blob(cx+dx*s,hy-hr*1.05+dy*s,11*s,11*s,seed=seed+k) for k,(dx,dy) in enumerate([(-20,6),(-7,-4),(8,-4),(21,6)])]
    for k,p in enumerate(parts):
        body.append(f'<path d="{p}" fill="#FBF3E4"/>')
        scribble(p,(cx-hr*1.6,hy-hr*1.4,cx+hr*1.6,hy+hr*.6),hair,-50,4,3.8,.97,seed+5+k); line(p,2.8)
    if phones:
        band=f"M{cx-hr*1.08:.1f} {hy+2*s:.1f}Q{cx:.1f} {hy-hr*1.75:.1f} {cx+hr*1.08:.1f} {hy+2*s:.1f}"
        body.append(f'<path d="{band}" stroke="{PEN}" stroke-width="{10*s:.1f}" fill="none" class="pen"/><path d="{band}" stroke="{phones}" stroke-width="{6.5*s:.1f}" fill="none" class="pen"/>')
        for ex in (-1,1):
            cup=blob(cx+ex*hr*1.05,hy+4*s,9*s,13*s,8,seed=seed+ex)
            body.append(f'<path d="{cup}" fill="{phones}"/>'); line(cup,2.8)
    # face
    fx=cx+face_dx
    body.append(f'<circle cx="{fx-hr*.34:.1f}" cy="{hy+hr*.08:.1f}" r="{3.6*s:.1f}" fill="{PEN}"/><circle cx="{fx+hr*.34:.1f}" cy="{hy+hr*.08:.1f}" r="{3.6*s:.1f}" fill="{PEN}"/>')
    line(f"M{fx-hr*.3:.1f} {hy+hr*.42:.1f}q{hr*.3:.1f} {hr*.3:.1f} {hr*.6:.1f} 0",3)
    body.append(f'<ellipse cx="{fx-hr*.6:.1f}" cy="{hy+hr*.35:.1f}" rx="{5*s:.1f}" ry="{3.4*s:.1f}" fill="#F08A72" opacity=".6"/><ellipse cx="{fx+hr*.6:.1f}" cy="{hy+hr*.35:.1f}" rx="{5*s:.1f}" ry="{3.4*s:.1f}" fill="#F08A72" opacity=".6"/>')

def cube(x,y,s,front,top,side,seed,letter=None):
    f=poly([(x,y),(x+s,y),(x+s,y+s),(x,y+s)])
    t=poly([(x,y),(x+s*.3,y-s*.27),(x+s*1.3,y-s*.27),(x+s,y)])
    sd=poly([(x+s,y),(x+s*1.3,y-s*.27),(x+s*1.3,y+s*.73),(x+s,y+s)])
    body.append(f'<path d="{f}" fill="#FBF3E4"/><path d="{t}" fill="#FBF3E4"/><path d="{sd}" fill="#FBF3E4"/>')
    scribble(f,(x,y,x+s,y+s),front,-35,5.5,4.4,.95,seed,True)
    scribble(t,(x,y-s*.27,x+s*1.3,y),top,-20,5.5,4.2,.95,seed+1,True)
    scribble(sd,(x+s,y-s*.27,x+s*1.3,y+s),side,-60,5.5,4.4,.95,seed+2,True)
    for d in (f,t,sd): line(d,3.4)
    if letter:
        L={"A":f"M{x+30} {y+78}L{x+50} {y+22}L{x+70} {y+78}M{x+38} {y+58}L{x+62} {y+58}",
           "B":f"M{x+35} {y+22}V{y+78}M{x+35} {y+22}h16q18 0 18 14q0 14-18 14h-16M{x+35} {y+50}h20q18 0 18 14q0 14-18 14h-20",
           "C":f"M{x+70} {y+33}A26 28 0 1 0 {x+70} {y+67}"}[letter]
        body.append(f'<path d="{L}" stroke="{PEN}" stroke-width="17" fill="none" class="pen"/><path d="{L}" stroke="#FFF7E6" stroke-width="11" fill="none" class="pen"/>')

body.append('<g transform="translate(8 -48) translate(540 745) scale(1.03) translate(-540 -745)">')
# kid C (back, small) - waving
kid(548,706,.78,"#E0A97C","#6B4226","#F5A623","#4A7FC1","curly",[540,558],
    [(528,(508,572),(510,606)),(568,(574,668),None)],11)
# tower: red base, yellow on top
cube(565,660,100,"#D8453C","#EE7468","#A82E28",10,"A")
cube(565,560,100,"#F6C230","#FBDB6E","#D49C12",20,"B")
# kid B right, reaching up to tower
kid(775,756,1.1,"#A5673F","#2B1B12","#E96F8E","#7B5CC4","pigtails",[762,792],
    [(748,(703,600),(722,632)),(803,(832,572),(834,612))],21,face_dx=-2)
# blue cube being pushed, kid A left
cube(385,655,100,"#2F6FD0","#6A9BEA","#1F4FA0",30,"C")
kid(283,752,1.1,"#F2C6A0","#5A3A22","#3FA796","#2E4A8F","short",[246,314],
    [(310,(388,652),(352,640)),(256,(388,684),(330,676))],31,face_dx=4,phones="#F29A4A")


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
open("logo_uel_espectro.svg","w").write(svg)
