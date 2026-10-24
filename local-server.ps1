param([int]$Port = 5173)

$root = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()
$types = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'
  '.svg'  = 'image/svg+xml'
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  $stream = $client.GetStream()
  $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
  $requestLine = $reader.ReadLine()
  do {
    $headerLine = $reader.ReadLine()
  } while ($null -ne $headerLine -and $headerLine.Length -gt 0)
  $pathPart = if ($requestLine) { ($requestLine -split ' ')[1] } else { '/' }
  $relativePath = [Uri]::UnescapeDataString(($pathPart -split '\?')[0].TrimStart('/'))
  if ([string]::IsNullOrWhiteSpace($relativePath)) { $relativePath = 'index.html' }
  $candidate = [System.IO.Path]::GetFullPath((Join-Path $root $relativePath))
  $validPath = $candidate.StartsWith(($root.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar), [System.StringComparison]::OrdinalIgnoreCase)
  if ($validPath -and (Test-Path -LiteralPath $candidate -PathType Leaf)) {
    $extension = [System.IO.Path]::GetExtension($candidate).ToLowerInvariant()
    if ($types.ContainsKey($extension)) { $contentType = $types[$extension] } else { $contentType = 'application/octet-stream' }
    $bytes = [System.IO.File]::ReadAllBytes($candidate)
    $status = '200 OK'
  } else {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
    $contentType = 'text/plain; charset=utf-8'
    $status = '404 Not Found'
  }
  $header = "HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
  $stream.Write($headerBytes, 0, $headerBytes.Length)
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Dispose()
  $client.Dispose()
}
