# Test JSearch API
Write-Host "`n=== Testing JSearch API (RapidAPI) ===" -ForegroundColor Cyan

$headers = @{
    "X-RapidAPI-Key" = "036db2cc42msh4885adec7978e03p100b32jsn14452753f9ab"
    "X-RapidAPI-Host" = "jsearch.p.rapidapi.com"
}

$params = @{
    query = "Software Engineer Intern in San Francisco"
    page = "1"
    num_pages = "1"
}

$queryString = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$([System.Uri]::EscapeDataString($_.Value))" }) -join "&"
$url = "https://jsearch.p.rapidapi.com/search?$queryString"

Write-Host "Searching for: Software Engineer Intern in San Francisco" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $url -Method GET -Headers $headers
    
    Write-Host "`nStatus: Success" -ForegroundColor Green
    Write-Host "Total Jobs Found: $($response.data.Count)" -ForegroundColor Magenta
    
    if ($response.data.Count -gt 0) {
        Write-Host "`nFirst 3 Jobs:" -ForegroundColor Cyan
        $response.data[0..2] | ForEach-Object {
            Write-Host "  - $($_.job_title) at $($_.employer_name)" -ForegroundColor White
            Write-Host "    Location: $($_.job_city), $($_.job_state)" -ForegroundColor Gray
            Write-Host "    Type: $($_.job_employment_type)" -ForegroundColor Gray
            Write-Host ""
        }
    }
    
    $response | ConvertTo-Json -Depth 10 | Out-File -FilePath "jsearch-response.json" -Encoding utf8
    Write-Host "Full response saved to: jsearch-response.json" -ForegroundColor Green
    
} catch {
    Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
}
