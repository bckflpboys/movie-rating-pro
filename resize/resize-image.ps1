Add-Type -AssemblyName System.Drawing

$sourcePath = "e:\web\chrome extentions\movie list\resize\Picsart_25-12-29_17-47-58-158.jpg"
$outputPath = "e:\web\chrome extentions\movie list\resize\resized\Picsart_25-12-29_17-47-58-158.jpg"
$targetWidth = 1400
$targetHeight = 560

# Load the source image
$sourceImg = [System.Drawing.Image]::FromFile($sourcePath)

Write-Host "Source image loaded: $($sourceImg.Width)x$($sourceImg.Height)"
Write-Host "Target size: ${targetWidth}x${targetHeight}"

# Function to create high-quality resized image
function Resize-Image {
    param(
        [System.Drawing.Image]$SourceImage,
        [int]$Width,
        [int]$Height
    )
    
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
    $destImage = New-Object System.Drawing.Bitmap($Width, $Height)
    
    $destImage.SetResolution($SourceImage.HorizontalResolution, $SourceImage.VerticalResolution)
    
    $graphics = [System.Drawing.Graphics]::FromImage($destImage)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $wrapMode = New-Object System.Drawing.Imaging.ImageAttributes
    $wrapMode.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
    
    $graphics.DrawImage($SourceImage, $destRect, 0, 0, $SourceImage.Width, $SourceImage.Height, [System.Drawing.GraphicsUnit]::Pixel, $wrapMode)
    
    $graphics.Dispose()
    $wrapMode.Dispose()
    
    return $destImage
}

# Create resized image
Write-Host "Resizing image to ${targetWidth}x${targetHeight}..."
$resizedImg = Resize-Image -SourceImage $sourceImg -Width $targetWidth -Height $targetHeight

# Save with high quality JPEG settings
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 95L)

# Get JPEG codec
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

Write-Host "Saving resized image with 95% quality..."
$resizedImg.Save($outputPath, $jpegCodec, $encoderParams)

# Cleanup
$resizedImg.Dispose()
$sourceImg.Dispose()
$encoderParams.Dispose()

Write-Host "`nImage resized successfully!" -ForegroundColor Green
Write-Host "Output: $outputPath" -ForegroundColor Cyan
Write-Host "Size: ${targetWidth}x${targetHeight}" -ForegroundColor Cyan
