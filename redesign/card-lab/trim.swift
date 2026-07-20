// Trim a PNG to its alpha bounding box (+2px pad) and cap the long edge at 900px.
// Usage: swift trim.swift <file.png>
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let path = CommandLine.arguments[1]
let url = URL(fileURLWithPath: path)
guard let srcRef = CGImageSourceCreateWithURL(url as CFURL, nil),
      let img = CGImageSourceCreateImageAtIndex(srcRef, 0, nil) else { exit(1) }

let w = img.width, h = img.height
var buf = [UInt8](repeating: 0, count: w * h)
let ctx = CGContext(data: &buf, width: w, height: h, bitsPerComponent: 8,
                    bytesPerRow: w, space: CGColorSpaceCreateDeviceGray(),
                    bitmapInfo: CGImageAlphaInfo.alphaOnly.rawValue)!
ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))

var minX = w, minY = h, maxX = -1, maxY = -1
for y in 0..<h { for x in 0..<w where buf[y * w + x] > 8 {
    if x < minX { minX = x }; if x > maxX { maxX = x }
    if y < minY { minY = y }; if y > maxY { maxY = y }
}}
guard maxX >= 0 else { exit(2) }
let pad = 2
minX = max(0, minX - pad); minY = max(0, minY - pad)
maxX = min(w - 1, maxX + pad); maxY = min(h - 1, maxY + pad)
guard let cropped = img.cropping(to: CGRect(x: minX, y: minY,
                                            width: maxX - minX + 1, height: maxY - minY + 1)) else { exit(1) }

// scale long edge to 900
let cw = cropped.width, ch = cropped.height
let scale = min(1.0, 900.0 / Double(max(cw, ch)))
let nw = Int(Double(cw) * scale), nh = Int(Double(ch) * scale)
let outCtx = CGContext(data: nil, width: nw, height: nh, bitsPerComponent: 8,
                       bytesPerRow: 0, space: CGColorSpaceCreateDeviceRGB(),
                       bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
outCtx.interpolationQuality = .high
outCtx.draw(cropped, in: CGRect(x: 0, y: 0, width: nw, height: nh))
guard let outImg = outCtx.makeImage(),
      let dest = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil) else { exit(1) }
CGImageDestinationAddImage(dest, outImg, nil)
CGImageDestinationFinalize(dest)
print("ok \(url.lastPathComponent) \(nw)x\(nh)")
