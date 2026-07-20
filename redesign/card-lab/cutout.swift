// Subject cutout via Apple Vision (same engine as Finder's "Remove Background").
// Usage: swift cutout.swift <in.jpg> <out.png>
import Foundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins
import UniformTypeIdentifiers
import ImageIO

let args = CommandLine.arguments
guard args.count == 3 else { fputs("usage: cutout <in> <out.png>\n", stderr); exit(1) }
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let src = CIImage(contentsOf: inURL, options: [.applyOrientationProperty: true]) else {
    fputs("cannot read \(args[1])\n", stderr); exit(1)
}

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: src, options: [:])
try handler.perform([request])

guard let result = request.results?.first else {
    fputs("no subject found in \(args[1])\n", stderr); exit(2)
}
let maskPixelBuffer = try result.generateScaledMaskForImage(
    forInstances: result.allInstances, from: handler)

let mask = CIImage(cvPixelBuffer: maskPixelBuffer)
let blend = CIFilter.blendWithMask()
blend.inputImage = src
blend.backgroundImage = CIImage(color: .clear).cropped(to: src.extent)
blend.maskImage = mask
guard let outImage = blend.outputImage else { fputs("blend failed\n", stderr); exit(1) }

let ctx = CIContext()
guard let cg = ctx.createCGImage(outImage, from: outImage.extent) else {
    fputs("render failed\n", stderr); exit(1)
}
guard let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.png.identifier as CFString, 1, nil) else {
    fputs("cannot write \(args[2])\n", stderr); exit(1)
}
CGImageDestinationAddImage(dest, cg, nil)
CGImageDestinationFinalize(dest)
print("ok \(outURL.lastPathComponent)")
