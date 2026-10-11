import base64, random, math
B="#5A3E2B"; SW=5
font=base64.b64encode(open("Fredoka.ttf","rb").read()).decode()
out=[]
def a(s): out.append(s)

def kid(cx,gy,s,skin,hair,shirt,pants,style,arms,phones=None,eyes="closed"):
    hr=44*s; hy=gy-150*s
    for lx in (cx-11*s,cx+11*s):
        a(f'<rect x="{lx-7*s:.1f}" y="{gy-42*s:.1f}" width="{14*s:.1f}" height="{36*s:.1f}" rx="{6*s:.1f}" fill="{skin}" stroke="{B}" stroke-width="{SW}"/>')
        a(f'<ellipse cx="{lx+(-3 if lx<cx else 3)*s:.1f}" cy="{gy-6*s:.1f}" rx="{13*s:.1f}" ry="{8*s:.1f}" fill="#8A6450" stroke="{B}" stroke-width="{SW}"/>')
    a(f'<rect x="{cx-30*s:.1f}" y="{gy-64*s:.1f}" width="{60*s:.1f}" height="{28*s:.1f}" rx="{10*s:.1f}" fill="{pants}" stroke="{B}" stroke-width="{SW}"/>')
    a(f'<rect x="{cx-31*s:.1f}" y="{gy-110*s:.1f}" width="{62*s:.1f}" height="{56*s:.1f}" rx="{20*s:.1f}" fill="{shirt}" stroke="{B}" stroke-width="{SW}"/>')
    for (side,hand,ctrl) in arms:
        sx=cx+side*24*s; sy=gy-96*s
        d=f"M{sx:.1f} {sy:.1f}Q{ctrl[0]:.1f} {ctrl[1]:.1f} {hand[0]:.1f} {hand[1]:.1f}"
        a(f'<path d="{d}" stroke="{B}" stroke-width="{12*s+2*SW:.1f}" fill="none" stroke-linecap="round"/>')
        a(f'<path d="{d}" stroke="{skin}" stroke-width="{12*s:.1f}" fill="none" stroke-linecap="round"/>')
        a(f'<circle cx="{sx:.1f}" cy="{sy+2*s:.1f}" r="{11*s:.1f}" fill="{shirt}"/>')
        a(f'<circle cx="{hand[0]:.1f}" cy="{hand[1]:.1f}" r="{9*s:.1f}" fill="{skin}" stroke="{B}" stroke-width="{SW}"/>')
    if style=="buns":
        for bx in (-1,1): a(f'<circle cx="{cx+bx*32*s:.1f}" cy="{hy-34*s:.1f}" r="{20*s:.1f}" fill="{hair}" stroke="{B}" stroke-width="{SW}"/>')
    if not phones:
        for ex in (-1,1): a(f'<circle cx="{cx+ex*43*s:.1f}" cy="{hy+6*s:.1f}" r="{9*s:.1f}" fill="{skin}" stroke="{B}" stroke-width="{SW}"/>')
    a(f'<circle cx="{cx}" cy="{hy:.1f}" r="{hr:.1f}" fill="{skin}" stroke="{B}" stroke-width="{SW}"/>')
    if style=="curly":
        for k,(dx,dy) in enumerate([(-36,-14),(-26,-34),(-8,-44),(12,-44),(30,-34),(39,-14)]):
            a(f'<circle cx="{cx+dx*s:.1f}" cy="{hy+dy*s:.1f}" r="{15*s:.1f}" fill="{hair}" stroke="{B}" stroke-width="{SW}"/>')
    k=s
    if style=="buns":
        cap=f"M{cx-44*k:.1f} {hy+4*k:.1f}C{cx-48*k:.1f} {hy-54*k:.1f} {cx+48*k:.1f} {hy-54*k:.1f} {cx+44*k:.1f} {hy+4*k:.1f}C{cx+32*k:.1f} {hy-16*k:.1f} {cx+12*k:.1f} {hy-24*k:.1f} {cx:.1f} {hy-12*k:.1f}C{cx-12*k:.1f} {hy-24*k:.1f} {cx-32*k:.1f} {hy-16*k:.1f} {cx-44*k:.1f} {hy+4*k:.1f}Z"
    else:
        cap=f"M{cx-45*k:.1f} {hy+2*k:.1f}C{cx-50*k:.1f} {hy-58*k:.1f} {cx+50*k:.1f} {hy-58*k:.1f} {cx+45*k:.1f} {hy+2*k:.1f}C{cx+38*k:.1f} {hy-16*k:.1f} {cx+20*k:.1f} {hy-22*k:.1f} {cx+4*k:.1f} {hy-16*k:.1f}C{cx-12*k:.1f} {hy-28*k:.1f} {cx-34*k:.1f} {hy-20*k:.1f} {cx-45*k:.1f} {hy+2*k:.1f}Z"
    a(f'<path d="{cap}" fill="{hair}" stroke="{B}" stroke-width="{SW}" stroke-linejoin="round"/>')
    if phones:
        band=f"M{cx-47*s:.1f} {hy:.1f}C{cx-52*s:.1f} {hy-74*s:.1f} {cx+52*s:.1f} {hy-74*s:.1f} {cx+47*s:.1f} {hy:.1f}"
        a(f'<path d="{band}" stroke="{B}" stroke-width="{9*s+2*SW:.1f}" fill="none" stroke-linecap="round"/><path d="{band}" stroke="{phones}" stroke-width="{9*s:.1f}" fill="none" stroke-linecap="round"/>')
        for ex in (-1,1): a(f'<rect x="{cx+ex*46*s-11*s:.1f}" y="{hy-12*s:.1f}" width="{22*s:.1f}" height="{32*s:.1f}" rx="{10*s:.1f}" fill="{phones}" stroke="{B}" stroke-width="{SW}"/>')
    ey=hy+8*s
    for ex in (-1,1):
        x=cx+ex*16*s
        if eyes=="closed": a(f'<path d="M{x-7*s:.1f} {ey+2*s:.1f}q{7*s:.1f} {-9*s:.1f} {14*s:.1f} 0" stroke="{B}" stroke-width="{4.2*s:.1f}" fill="none" stroke-linecap="round"/>')
        else: a(f'<circle cx="{x:.1f}" cy="{ey:.1f}" r="{4.6*s:.1f}" fill="{B}"/>')
        a(f'<ellipse cx="{cx+ex*27*s:.1f}" cy="{ey+12*s:.1f}" rx="{8*s:.1f}" ry="{5.5*s:.1f}" fill="#F3999A" opacity=".75"/>')
    a(f'<path d="M{cx-8*s:.1f} {ey+12*s:.1f}q{8*s:.1f} {9*s:.1f} {16*s:.1f} 0" stroke="{B}" stroke-width="{4*s:.1f}" fill="none" stroke-linecap="round"/>')

def block(x,y,sz,col,letter,rot=0):
    cx,cy=x+sz/2,y+sz/2
    a(f'<g transform="rotate({rot} {cx} {cy})"><rect x="{x}" y="{y}" width="{sz}" height="{sz}" rx="14" fill="{col}" stroke="{B}" stroke-width="{SW}"/>'
      f'<rect x="{x+9}" y="{y+9}" width="{sz-18}" height="{sz-18}" rx="9" fill="none" stroke="#FFF8EC" stroke-width="3" opacity=".8"/>'
      f'<text x="{cx}" y="{cy+22}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="64" fill="{B}" stroke="{B}" stroke-width="10" stroke-linejoin="round">{letter}</text>'
      f'<text x="{cx}" y="{cy+22}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="64" fill="#FFF8EC">{letter}</text></g>')

def sparkle(x,y,r,col="#F6C66E"):
    a(f'<path d="M{x} {y-r}Q{x} {y} {x+r} {y}Q{x} {y} {x} {y+r}Q{x} {y} {x-r} {y}Q{x} {y} {x} {y-r}Z" fill="{col}" stroke="{B}" stroke-width="3.5" stroke-linejoin="round"/>')

def flower(x,y,col,r=11):
    a(f'<path d="M{x} {y}q-3 22 2 40" stroke="{B}" stroke-width="4" fill="none"/>')
    a(f'<path d="M{x} {y+26}q-18-12-20 4q14 8 20-4z" fill="#9CCB86" stroke="{B}" stroke-width="3.5"/>')
    for i in range(5):
        t=math.radians(i*72-90)
        a(f'<circle cx="{x+r*math.cos(t):.1f}" cy="{y+r*math.sin(t):.1f}" r="{r*.75:.1f}" fill="{col}" stroke="{B}" stroke-width="3.5"/>')
    a(f'<circle cx="{x}" cy="{y}" r="{r*.55:.1f}" fill="#F6C66E" stroke="{B}" stroke-width="3.5"/>')

# ---------------- scene
CX,CY,R=540,540,318
a(f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="#D9ECE2"/>')
a('<g clip-path="url(#pic)">')
for rr,col in ((262,"#F5B9A3"),(226,"#F8D893"),(190,"#AFD9CE")):
    a(f'<path d="M{CX-rr} 740A{rr} {rr} 0 0 1 {CX+rr} 740" stroke="{col}" stroke-width="36" fill="none"/>')
# clouds at the arch feet
for x in (CX-226,CX+226):
    a(f'<path d="M{x-62} 742c-6-26 22-40 40-28c6-26 46-30 56-6c22-10 46 6 40 34z" fill="#FFFDF8" stroke="{B}" stroke-width="{SW}" stroke-linejoin="round"/>')
a(f'<path d="M{CX-360} 760Q{CX} 680 {CX+360} 760L{CX+360} 900L{CX-360} 900Z" fill="#BFDDA6" stroke="{B}" stroke-width="{SW}"/>')
flower(392,782,"#F5B9A3",10); flower(640,772,"#C3B6EA"); flower(720,800,"#AFD9CE",9)
# tower
block(532,642,92,"#F29E85","A",0)
block(536,549,92,"#F6C66E","B",-3)
# girl placing C (behind block C drawn after arm)
kid(380,742,1.08,"#F6CBA5","#9C90D9","#F4A6A6","#7FB7C9","buns",
    [(-1,(340,700),(326,668)),(1,(482,526),(456,590))],eyes="closed")
block(474,446,92,"#7FC4B8","C",9)
# redraw girl's hand on top of block
a(f'<circle cx="482" cy="526" r="9.7" fill="#F6CBA5" stroke="{B}" stroke-width="{SW}"/>')
# boy with headphones steadying tower
kid(742,742,1.08,"#D39A6E","#4A3326","#8FB4E3","#6C7FB8","short",
    [(-1,(636,606),(680,646)),(1,(784,700),(794,668))],phones="#F29E85",eyes="open")
# small kid sitting in front reading
def reader(cx,gy):
    s=.8; hy=gy-108
    a(f'<ellipse cx="{cx-22}" cy="{gy-6}" rx="13" ry="8" fill="#8A6450" stroke="{B}" stroke-width="{SW}"/><ellipse cx="{cx+22}" cy="{gy-6}" rx="13" ry="8" fill="#8A6450" stroke="{B}" stroke-width="{SW}"/>')
    a(f'<rect x="{cx-30}" y="{gy-74}" width="60" height="62" rx="22" fill="#F6C66E" stroke="{B}" stroke-width="{SW}"/>')
    a(f'<circle cx="{cx-34}" cy="{hy+6}" r="7.5" fill="#E8B58C" stroke="{B}" stroke-width="{SW}"/><circle cx="{cx+34}" cy="{hy+6}" r="7.5" fill="#E8B58C" stroke="{B}" stroke-width="{SW}"/>')
    a(f'<circle cx="{cx}" cy="{hy}" r="36" fill="#E8B58C" stroke="{B}" stroke-width="{SW}"/>')
    for dx,dy in [(-29,-12),(-21,-28),(-7,-36),(8,-36),(22,-28),(30,-12)]:
        a(f'<circle cx="{cx+dx}" cy="{hy+dy}" r="12" fill="#C9734B" stroke="{B}" stroke-width="{SW}"/>')
    a(f'<path d="M{cx-27} {hy-2}C{cx-24} {hy-34} {cx+24} {hy-34} {cx+27} {hy-2}C{cx+10} {hy-16} {cx-10} {hy-16} {cx-27} {hy-2}Z" fill="#C9734B"/>')
    for ex in (-1,1):
        a(f'<path d="M{cx+ex*13-5} {hy+10}q5-6 10 0" stroke="{B}" stroke-width="3.6" fill="none" stroke-linecap="round"/>')
        a(f'<ellipse cx="{cx+ex*22}" cy="{hy+17}" rx="6.5" ry="4.5" fill="#F3999A" opacity=".75"/>')
    a(f'<path d="M{cx-6} {hy+20}q6 7 12 0" stroke="{B}" stroke-width="3.4" fill="none" stroke-linecap="round"/>')
    # open book
    a(f'<path d="M{cx} {gy-58}L{cx-46} {gy-66}L{cx-44} {gy-24}L{cx} {gy-18}L{cx+44} {gy-24}L{cx+46} {gy-66}Z" fill="#F29E85" stroke="{B}" stroke-width="{SW}" stroke-linejoin="round"/>')
    a(f'<path d="M{cx} {gy-62}L{cx-40} {gy-70}L{cx-39} {gy-30}L{cx} {gy-23}Z M{cx} {gy-62}L{cx+40} {gy-70}L{cx+39} {gy-30}L{cx} {gy-23}Z" fill="#FFFDF8" stroke="{B}" stroke-width="4" stroke-linejoin="round"/>')
    for i in range(3):
        y=gy-58+i*9
        a(f'<path d="M{cx-32} {y-4}L{cx-8} {y}M{cx+8} {y}L{cx+32} {y-4}" stroke="#C8B6A6" stroke-width="3" stroke-linecap="round"/>')
    for ex in (-1,1): a(f'<circle cx="{cx+ex*44}" cy="{gy-44}" r="8.5" fill="#E8B58C" stroke="{B}" stroke-width="{SW}"/>')
reader(474,772)
a('</g>')
a(f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="none" stroke="{B}" stroke-width="6"/>')
sparkle(300,370,20); sparkle(780,330,16,"#AFD9CE"); sparkle(800,450,11); sparkle(332,470,10,"#F5B9A3")
for x,y,c in ((360,300,"#F5B9A3"),(720,265,"#C3B6EA"),(250,560,"#AFD9CE"),(838,600,"#F6C66E")):
    a(f'<circle cx="{x}" cy="{y}" r="6" fill="{c}" stroke="{B}" stroke-width="3"/>')

scene="\n".join(out)
rnd=random.Random(3)
speck="".join(f'<circle cx="{rnd.uniform(0,1080):.0f}" cy="{rnd.uniform(0,1080):.0f}" r="{rnd.uniform(.8,2):.1f}" fill="#B59A80" opacity="{rnd.uniform(.25,.55):.2f}"/>' for _ in range(520))

svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
<defs>
<style>@font-face{{font-family:"Fredoka";src:url(data:font/ttf;base64,{font}) format("truetype");font-weight:300 700;}}</style>
<clipPath id="pic"><circle cx="540" cy="540" r="315"/></clipPath>
<path id="top" d="M540 905A365 365 0 0 1 540 175A365 365 0 0 1 540 905"/>
<path id="bot" d="M540 132A408 408 0 0 0 540 948A408 408 0 0 0 540 132"/>
</defs>
<rect width="1080" height="1080" fill="#FAF1E4"/>
{speck}
<circle cx="540" cy="540" r="468" fill="none" stroke="#EDD3B8" stroke-width="5"/>
{scene}
<g font-family="Fredoka" font-weight="600" font-size="47">
<text text-anchor="middle" fill="{B}"><textPath href="#top" startOffset="50%" textLength="1290" lengthAdjust="spacing">ESCOLARIZAÇÃO DE CRIANÇAS E ADOLESCENTES</textPath></text>
<text text-anchor="middle" fill="#E07A5F"><textPath href="#bot" startOffset="50%" textLength="900" lengthAdjust="spacing">COM AUTISMO E PSICOSE <tspan fill="#E8A93A">•</tspan> UEL</textPath></text>
</g>
</svg>'''
open("logo_uel_pastel.svg","w").write(svg)
