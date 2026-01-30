package com.deloitte.GeoMine.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Unidade {
    KG("kg"),
    G("g"),
    T("t");

    private final String codigo;

    Unidade(String codigo) {
        this.codigo = codigo;
    }

    @JsonValue
    public String getCodigo() {
        return codigo;
    }

    @JsonCreator
    public static Unidade fromString(String value) {
        if (value == null) return null;
        switch (value.toLowerCase()) {
            case "kg": return KG;
            case "g": return G;
            case "t": return T;
            default: throw new IllegalArgumentException("Unidade inválida: " + value);
        }
    }
}
