<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <style>
        * { font-family: DejaVu Sans, sans-serif; }
        body { color: #1f2937; font-size: 13px; }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header h1 { color: #2563eb; margin: 0; font-size: 24px; }
        .header p { color: #6b7280; margin: 4px 0 0; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .info-box { width: 48%; }
        .info-box h3 { color: #2563eb; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; }
        .info-box p { margin: 2px 0; }
        .diagnosis {
            background: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .diagnosis h3 { margin: 0 0 6px; color: #1e40af; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #2563eb; color: white; padding: 8px; text-align: left; font-size: 12px; }
        td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #9ca3af;
            font-size: 11px;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
        .rx { font-size: 40px; color: #2563eb; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>NovaCare Hospital</h1>
        <p>Tibbi Resept</p>
    </div>

    <div class="info-row">
        <div class="info-box">
            <h3>Xəstə</h3>
            <p><strong>{{ $record->patient->user->name }}</strong></p>
            <p>Tarix: {{ $record->created_at->format('d.m.Y') }}</p>
        </div>
        <div class="info-box" style="text-align: right;">
            <h3>Həkim</h3>
            <p><strong>{{ $record->doctor->user->name }}</strong></p>
            <p>{{ $record->doctor->specialization }}</p>
        </div>
    </div>

    <div class="diagnosis">
        <h3>Diaqnoz</h3>
        <p>{{ $record->diagnosis }}</p>
        @if($record->notes)
            <p style="margin-top:8px; color:#6b7280;"><em>{{ $record->notes }}</em></p>
        @endif
    </div>

    <div class="rx">℞</div>

    <table>
        <thead>
            <tr>
                <th>Dərman</th>
                <th>Doza</th>
                <th>Müddət</th>
                <th>Təlimat</th>
            </tr>
        </thead>
        <tbody>
            @forelse($record->prescriptions as $p)
                <tr>
                    <td><strong>{{ $p->medicine }}</strong></td>
                    <td>{{ $p->dosage ?? '—' }}</td>
                    <td>{{ $p->duration ?? '—' }}</td>
                    <td>{{ $p->instructions ?? '—' }}</td>
                </tr>
            @empty
                <tr><td colspan="4" style="text-align:center; color:#9ca3af;">Resept yoxdur</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Bu sənəd NovaCare Hospital sistemi tərəfindən yaradılmışdır.</p>
        <p>{{ now()->format('d.m.Y H:i') }}</p>
    </div>
</body>
</html>
