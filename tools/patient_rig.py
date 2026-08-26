#!/usr/bin/env python3
"""Skeleton-first patient figure generator for sim.html.

Defines the supine rider as a joint rig with anthropometric proportions
(7.5-head figure, H = head height), skins each bone as a stadium capsule,
and patches the generated SVG group into sim.html between the
<!-- patient --> and <!-- daylight fading --> markers.

Proportions (classic figure-drawing ratios, H = head height):
  head 1.0H, torso (shoulder->hip) 2.3H, humerus 1.3H, forearm 1.2H,
  hand 0.35H radius-ish, femur 1.75H, tibia 1.6H, foot ~0.75H visible boot.
Supine: back on ground line, feet point UP, face points UP.
"""
import math

H = 40.0                 # head height in viewBox px
GROUND = 302.0           # ground contact line (y)
X0 = 250.0               # left edge of head

def pt(x, y): return (round(x, 1), round(y, 1))

# ---- joints ----
head_r = 0.475 * H                      # 19
head_c = pt(X0 + head_r, GROUND - head_r)          # (269, 283)
shoulder = pt(head_c[0] + head_r + 13, 288)         # gap clears the helmet shell (r23.5)
torso_r = 14.0
hip = pt(shoulder[0] + 2.3 * H, 288)                # +92
femur, tibia = 1.85 * H, 1.675 * H                  # 74, 67 (reads truncated at true ratio)
knee = pt(hip[0] + femur, 288)
# tibia: subtle kink through the armored pant, true apex-up angulation when exposed
frac_p = pt(knee[0] + 31, 285.5)
frac = pt(knee[0] + 31, 277)
ankle = pt(knee[0] + 67, 291)
toe = pt(ankle[0] + 6, ankle[1] - 16)               # boot points up (supine)
# near arm: shoulder -> elbow (down along body) -> hand resting on thigh
elbow = pt(shoulder[0] + 52, 291.5)
hand = pt(hip[0] + 22, hip[1] - torso_r + 1)        # on the thigh top
# far leg: offset up/left, simplified single bone
fhip, fankle = pt(hip[0] - 7, 281), pt(ankle[0] - 6, 284)
ftoe = pt(fankle[0] + 5, fankle[1] - 14)

def capsule(p1, p2, r, cls, extra=''):
    L = math.hypot(p2[0] - p1[0], p2[1] - p1[1])
    a = math.degrees(math.atan2(p2[1] - p1[1], p2[0] - p1[0]))
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%.1f" class="%s" '
            'transform="translate(%.1f %.1f) rotate(%.1f)"%s/>'
            % (-r, -r, L + 2 * r, 2 * r, r, cls, p1[0], p1[1], a, extra))

L = []
A = L.append

# pad (under everything)
A('<g id="pt-pad" style="display:none;">')
A('  <rect x="%.0f" y="300" width="%.0f" height="10" rx="5" class="o w2"/>' % (X0 - 6, toe[0] - X0 + 24))
A('  <path d="M%.0f,305 L%.0f,305" class="ln thin faint"/>' % (X0 + 4, toe[0] + 8))
A('</g>')

# far leg first (behind everything)
A(capsule(fhip, fankle, 8, 'o w thin'))
A(capsule(fankle, ftoe, 7.5, 'o w thin'))

# head
A('<circle cx="%.1f" cy="%.1f" r="%.1f" class="o skin"/>' % (head_c[0], head_c[1], head_r))
A('<g id="pt-hair" style="display:none;">')
A('  <path d="M%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f Z" class="o w2"/>'
  % (head_c[0] - head_r, head_c[1] + 3, head_r, head_r, head_c[0] - 2, head_c[1] - head_r + 1))
A('  <path d="M%.0f,%.0f q-5,2 -7,6 M%.0f,%.0f q-4,4 -4,8" class="ln thin"/>'
  % (head_c[0] - 6, head_c[1] - 14, head_c[0] - 12, head_c[1] - 8))
A('</g>')
# helmet: shell around head, face opening toward the sky
shell_c = pt(head_c[0] - 2, head_c[1] - 2)
face_c = pt(head_c[0] + 5, head_c[1] - 5)
A('<g id="pt-helmet">')
A('  <circle cx="%.1f" cy="%.1f" r="23.5" class="o a"/>' % shell_c)
A('  <path d="M%.1f,%.1f A23,23 0 0 0 %.1f,%.1f L%.1f,%.1f Z" class="a2"/>'
  % (shell_c[0] - 23, shell_c[1], shell_c[0], shell_c[1] + 23, shell_c[0], shell_c[1]))
A('  <circle cx="%.1f" cy="%.1f" r="10" class="o skin"/>' % face_c)
A('  <polygon points="%.0f,%.0f %.0f,%.0f %.0f,%.0f" class="o a thin"/>'
  % (shell_c[0] - 6, shell_c[1] - 23, shell_c[0] + 12, shell_c[1] - 26, shell_c[0] + 9, shell_c[1] - 16))
A('</g>')
# face (always on top of helmet/hair)
A('<circle cx="%.1f" cy="%.1f" r="1.8" class="dot"/>' % (face_c[0] - 2, face_c[1] - 5.5))
A('<path d="M%.1f,%.1f l8,-2.2" class="ln thin"/>' % (face_c[0] - 6, face_c[1] - 8))
A('<path d="M%.1f,%.1f q2.5,-3 5.5,-1.2" class="ln thin"/>' % (face_c[0] + 0.5, face_c[1] - 9))
A('<path d="M%.1f,%.1f q3.5,-2 7,-0.7" class="ln" style="stroke-width:1.6"/>' % (face_c[0] - 3.5, face_c[1] + 4))

# torso (jacket)
A(capsule(shoulder, pt(hip[0] - 8, hip[1]), torso_r, 'o w'))
A('<path d="M%.0f,%.0f L%.0f,%.0f" class="ln thin faint"/>'
  % ((shoulder[0] + hip[0]) / 2, shoulder[1] - torso_r + 2, (shoulder[0] + hip[0]) / 2, shoulder[1] + torso_r - 2))
A('<path d="M%.0f,%.0f q7,7 14,3" class="ln thin"/>' % (shoulder[0] - 4, shoulder[1] - torso_r + 4))

# pelvis bridge (pants)
A(capsule(pt(hip[0] - 8, 288), pt(hip[0] + 2, 288), 12, 'o w2'))

# near thigh
A(capsule(hip, knee, 10.5, 'o w2'))

# shin: pants / exposed variants share the bone line
A('<g id="pt-shin-pants">')
A('  ' + capsule(knee, frac_p, 8.5, 'o w2'))
A('  ' + capsule(frac_p, ankle, 8.5, 'o w2'))
A('</g>')
A('<g id="pt-shin-exposed" style="display:none;">')
A('  <polygon points="%.0f,%.0f %.0f,%.0f %.0f,%.0f %.0f,%.0f" class="o w2"/>'
  % (knee[0] + 2, knee[1] - 9, knee[0] + 10, knee[1] - 11, knee[0] + 12, knee[1] + 8, knee[0] + 3, knee[1] + 9))
A('  ' + capsule(knee, frac, 7, 'o skin'))
A('  ' + capsule(frac, ankle, 7, 'o skin'))
A('  <ellipse cx="%.1f" cy="%.1f" rx="13" ry="9" class="o skin"/>' % frac)
A('  <ellipse cx="%.1f" cy="%.1f" rx="9" ry="5.5" class="bru"/>' % frac)
A('  <path d="M%.0f,%.0f l-4,-6 M%.0f,%.0f l0,-7 M%.0f,%.0f l4,-6" class="ln"/>'
  % (frac[0] - 10, frac[1] - 13, frac[0], frac[1] - 15, frac[0] + 10, frac[1] - 13))
A('  <polygon points="%.0f,%.0f %.0f,%.0f %.0f,%.0f %.0f,%.0f" class="o w2"/>'
  % (ankle[0] - 4, ankle[1] - 10, ankle[0] + 4, ankle[1] - 12, ankle[0] + 2, ankle[1] + 7, ankle[0] - 6, ankle[1] + 8))
A('</g>')

# splint: immobilizes knee AND ankle (mid-femur to past the foot), boot toe visible above
A('<g id="pt-splint" style="display:none;">')
A('  <rect x="%.0f" y="272" width="%.0f" height="30" rx="6" class="o"/>' % (knee[0] - 15, (ankle[0] + 28) - (knee[0] - 15)))
sx = knee[0] - 9
hatch = ' '.join('M%.0f,300 L%.0f,275' % (x, x + 16) for x in range(int(sx), int(ankle[0] + 18), 22))
A('  <path d="%s" class="ln thin faint"/>' % hatch)
for x in (knee[0] - 10, frac[0] - 22, frac[0] + 16, ankle[0] + 12):
    A('  <rect x="%.0f" y="269" width="5" height="36" rx="2.5" class="o w2"/>' % x)
A('</g>')

# near boot (points up — supine), sole facing the toe side
A(capsule(ankle, toe, 9, 'o w2'))
sole_dx, sole_dy = 9.2, 2.6
A('<path d="M%.1f,%.1f L%.1f,%.1f M%.0f,%.0f l5,1.5 M%.0f,%.0f l5,1.5" class="ln thin"/>'
  % (toe[0] + sole_dx, toe[1] + sole_dy, ankle[0] + sole_dx, ankle[1] - 2,
     toe[0] - 8, toe[1] + 12, toe[0] - 7, toe[1] + 18))

# near arm on top: shoulder -> elbow -> hand on thigh
A(capsule(pt(shoulder[0] + 6, shoulder[1] - 1), elbow, 7.5, 'o w'))
A(capsule(elbow, hand, 6.5, 'o w'))
mid = pt((elbow[0] + hand[0]) / 2, (elbow[1] + hand[1]) / 2 - 1)
A('<circle cx="%.1f" cy="%.1f" r="6.8" class="o skin"/>' % hand)

# blanket (torso to mid-thigh), clear of face and splint zone
A('<g id="pt-blanket" style="display:none;">')
A('  <rect x="%.0f" y="266" width="%.0f" height="36" rx="15" class="o a"/>' % (shoulder[0] - 6, (knee[0] + 6) - (shoulder[0] - 6)))
A('  <path d="M%.0f,%.0f A21,21 0 0 1 %.0f,%.0f" style="stroke:#DDA483;stroke-width:9;fill:none;stroke-linecap:round"/>' % (head_c[0] - 20, head_c[1] + 7, head_c[0] - 3, head_c[1] - 21))
A('  <path d="M%.0f,268 q8,15 -2,32 M%.0f,267 q-8,16 3,33 M%.0f,268 q7,15 -2,32" class="ln thin"/>'
  % (shoulder[0] + 24, shoulder[0] + 76, shoulder[0] + 128))
A('</g>')

block = ('        <!-- patient (generated by tools/patient_rig.py — edit the rig, not these shapes) -->\n'
         '        <g transform="translate(-48.9 -36.3) scale(1.12)"><g id="pt-pos"><g id="pt-fig" filter="url(#rough)">\n'
         + '\n'.join('          ' + line for line in L)
         + '\n        </g></g></g>\n\n')

path = '/Users/owen/projects/medic/sim.html'
src = open(path).read()
start = src.index('        <!-- patient ')
end = src.index('        <!-- daylight fading -->')
open(path, 'w').write(src[:start] + block + src[end:])
print('rig applied: head_c=%s hip=%s knee=%s frac=%s ankle=%s toe=%s' % (head_c, hip, knee, frac, ankle, toe))
