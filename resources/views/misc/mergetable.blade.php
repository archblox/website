@php
use App\Models\User;
use App\Models\UserSetting;

$userCount = User::count();
$userSettingCount = UserSetting::count();

if ($userSettingCount >= $userCount) {
    echo 'Already merged.';
    return;
}

for ($i = 1; $i <= $userCount; $i++) {
    UserSetting::create(['user_id' => $i]);
}

echo 'Merged!';

@endphp