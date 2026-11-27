package ru.myapps.myapps;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(InstalledAppsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
