<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('old_name')->nullable();
            $table->boolean('changed_name')->default(false);
            $table->string('date_preference')->default('d/m/Y');
            $table->boolean('time_preference_24hr')->default(false);
            $table->integer('theme')->default(1);
            $table->integer('message_preference')->default(2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_settings');
    }
}
