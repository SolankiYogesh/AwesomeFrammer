package com.awesomeframmer.Modules;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.awesomeframmer.MainActivity;

public class UpdateReceiver extends BroadcastReceiver {
    private final String TAG = "UpdateReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i(TAG, "Restarting app with extra data: " + intent.getDataString());
        String extraData = intent.getStringExtra(Intent.EXTRA_TEXT); // Replace Intent.EXTRA_TEXT with the correct key if needed
        Log.i(TAG, "Restarting app with extra data: " + (extraData != null ? extraData : "No extra data"));

        Intent i = new Intent(context, MainActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); // https://stackoverflow.com/a/3689900
        context.startActivity(i);
    }
}
